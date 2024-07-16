import fs from "fs";
import { generateFileName } from "../lib/script-generators/scriptGenerator";
import { exec } from "pkg";
import path from "path";
import { tmpdir } from "os";

const temp = tmpdir();

export const pkgService = async () => {
  const fn = generateFileName("temp", ".cjs");

  const cwd = process.cwd();
  console.log(cwd);

  // const tempFile = cwd + temp + fn;
  // const tempDest = cwd + temp + "/test.exe";

  console.log(temp);

  const tempFilePath = path.join(temp, fn);
  const tempDestPath = path.join(temp, "test.exe");
  // const tempFilePath = path.join(cwd, temp, fn);
  // const tempDestPath = path.join(cwd, temp, "test.exe");

  console.log(tempFilePath, tempDestPath);

  fs.writeFileSync(tempFilePath, testApp, "utf8");

  await exec([tempFilePath, "--target", "node14-win-x64", "--output", tempDestPath]);

  const stream = fs.createReadStream(tempDestPath);
  stream.on("end", () => {
    fs.unlinkSync(tempFilePath);
    fs.unlinkSync(tempDestPath);
  });

  return stream;
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
