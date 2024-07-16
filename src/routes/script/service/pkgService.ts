import fs from "fs";
import { generateFileName } from "../lib/script-generators/scriptGenerator";
// import { exec as pkgExec } from "pkg";
import path from "path";
import { tmpdir } from "os";
import log from "../../../lib/logger";
import exec from "child_process";

const temp = tmpdir();

export const pkgService = async () => {
  const workingDir = process.cwd();

  const binariesPath = path.join(workingDir, "pkg-binaries");

  const fn = generateFileName("temp", ".cjs");

  const tempFilePath = path.join(temp, fn);
  const tempDestPath = path.join(temp, "test.exe");

  console.log({ tempFilePath, tempDestPath });

  const cleanUp = () => {
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
    if (fs.existsSync(tempDestPath)) {
      fs.unlinkSync(tempDestPath);
    }
  };

  const command = `cross-env PKG_CACHE_PATH=${binariesPath} && pkg ${tempFilePath} -t node18-win-x64 -o ${tempDestPath} -d`;

  try {
    fs.writeFileSync(tempFilePath, testApp, "utf8");

    exec.execSync(command);

    // await pkgExec([
    //   tempFilePath,
    //   "-t",
    //   "node18-win-x64",
    //   "-o",
    //   tempDestPath,
    //   "-d",
    // ]);

    const stream = fs.createReadStream(tempDestPath);
    stream.on("end", () => {
      cleanUp();
    });
    stream.on("error", (err) => {
      log("Error in stream... Cleaning up", "warn");
      cleanUp();
      log(err.message, "error");
    });

    return stream;
  } catch (err) {
    cleanUp();
  }
};

const testApp = `const { Readable, Transform, Writable, Stream } = require("stream");

const consoleIn = process.stdin;
const trans = new Stream.Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  },
});
const consoleOut = process.stdout;

consoleIn.pipe(trans).pipe(consoleOut);`;
