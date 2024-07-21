import os, { tmpdir } from "os";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import logger from "../../../../lib/logger";

const targets = {
  win: "win-x64",
  darwin: "darwin-x64",
  linux: "linux-x64",
};

type NodeSeaParams = {
  fileName: string;
  fileContent: string;
  binDir?: string;
  tempDir?: string;
  targetSig?: keyof typeof targets;
};

export default function createNodeSea(params: NodeSeaParams) {
  const { binDir, targetSig, ...rest } = params;

  const seaEx = sea({
    binDir: getTargetBinDir(binDir, targets[targetSig ?? "win"]),
    ...rest,
  });
  return seaEx.execute();
}

const sea = (params: NodeSeaParams) => {
  const { fileName, fileContent, binDir, tempDir } = params;

  const uniqueFileName = `${getRandNumber(10000, 99999)}-${fileName}`;
  const blobName = "sea-prep.blob";
  const configName = "sea-config.json";

  const createdFiles: string[] = [];

  const pathParams = {
    fileName: uniqueFileName,
    configName,
    blobName,
    tempDir,
    binDir,
  };

  const paths = createFolderPaths(pathParams);

  const transcribeProgram = () => {
    fs.writeFileSync(paths.jsFilePath, fileContent);
    createdFiles.push(paths.jsFilePath);
  };

  const generateConfig = () => {
    const config = {
      main: paths.jsFilePath,
      output: paths.blobPath,
    };

    fs.writeFileSync(paths.configPath, JSON.stringify(config, null, 2));
    createdFiles.push(paths.configPath);
  };

  const generateSeaBlob = () => {
    execSync(`node --experimental-sea-config ${paths.configPath}`);
    createdFiles.push(paths.blobPath);
  };

  const generateExeFromNodeBinary = () => {
    const binaryLoc = paths.binDir ?? process.execPath;
    fs.copyFileSync(binaryLoc, paths.exePath);
    createdFiles.push(paths.exePath);
  };

  const injectBlob = () => {
    execSync(
      `npx postject ${paths.exePath} NODE_SEA_BLOB ${paths.blobPath} --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2`
    );
  };
  const createExe = () => {
    try {
      transcribeProgram();
      generateConfig();
      generateSeaBlob();
      generateExeFromNodeBinary();
      injectBlob();
      return true;
    } catch (e) {
      const error = e as Error;
      logger(error.message, "error");
      console.error(e);
      clearFolderAsync(paths.tmpDir, createdFiles);
      return false;
    }
  };

  const streamExe = () => {
    const stream = fs.createReadStream(paths.exePath);
    stream.on("end", () => {
      clearFolderAsync(paths.tmpDir, createdFiles);
    });
    stream.on("error", (err) => {
      clearFolderAsync(paths.tmpDir, createdFiles);
      throw new Error(err.message);
    });

    return stream;
  };

  const execute = () => {
    const created = createExe();
    if (created) return streamExe();
  };

  return {
    execute,
  };
};

const getTargetBinDir = (binDir?: string, targetSig?: string) => {
  if (binDir === undefined) return undefined;

  const files = fs.readdirSync(binDir);

  if (files.length === 0) {
    throw new Error("No prebuilt binaries found in the specified directory");
  }

  let platform: string;
  let arch: string;

  if (targetSig) {
    [platform, arch] = targetSig.split("-");
  } else {
    const { platform: p, arch: a } = getOsInfo();
    platform = p;
    arch = a;
  }

  const targetBinary = files.find((file) => {
    return file.includes(platform) && file.includes(arch);
  });

  files.forEach((file) => logger(file));
  if (targetBinary) logger(targetBinary);

  if (targetBinary === undefined) {
    throw new Error(
      "No binary found for the current platform and architecture, " +
        "the expected format is <binDir>/node-{version}-{platform}-{arch}/node.exe"
    );
  }

  const targetBinPath = path.join(binDir, targetBinary);
  const target = path.join(targetBinPath, "node.exe");

  if (!fs.existsSync(target)) {
    throw new Error("No node.exe found in the target binary directory");
  }

  return target;
};

const osMap = new Map([
  ["win32", "win"],
  ["darwin", "darwin"],
  ["linux", "linux"],
  // Unimplemented os types
  // ["aix", "aix"],
  // ["freebsd", "freebsd"],
  // ["openbsd", "openbsd"],
  // ["sunos", "sunos"],
]);

const getOsInfo = () => {
  const platform = osMap.get(os.platform());
  const arch = os.arch();
  if (platform === undefined) {
    throw new Error("Unsupported OS");
  }

  return { platform, arch };
};

type FolderPathParams = {
  fileName: string;
  configName: string;
  blobName: string;
  tempDir?: string;
  binDir?: string;
};

const createFolderPaths = (params: FolderPathParams) => {
  const folderLoc = params.tempDir || tmpdir();
  logger(folderLoc);
  return {
    jsFilePath: path.join(folderLoc, params.fileName + ".js"),
    configPath: path.join(folderLoc, params.configName),
    exePath: path.join(folderLoc, `${normalizeFileName(params.fileName)}.exe`),
    blobPath: path.join(folderLoc, params.blobName),
    tmpDir: folderLoc,
    binDir: params.binDir,
  };
};

const getRandNumber = (num1 = 0, num2 = 1) => {
  const min = Math.min(num1, num2);
  const max = Math.max(num1, num2);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const normalizeFileName = (fileName: string) => fileName.split(".")[0];

//TODO: Impl logic to clear folder of only files created by this script
const clearFolderAsync = (dir: string, filesToDelete: string[]) => {
  const deleteIfExists = (path: string) => {
    fs.existsSync(path) && fs.unlinkSync(path);
  };
  fs.readdir(dir, (err, files) => {
    if (err) {
      throw new Error(err.message);
    }
    files.forEach((file) => {
      const filePath = path.join(dir, file);
      if (filesToDelete.includes(filePath)) {
        deleteIfExists(filePath);
      }
    });
  });
};
