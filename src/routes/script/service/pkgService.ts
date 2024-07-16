import fs from "fs";
import { generateFileName } from "../lib/script-generators/scriptGenerator";
import { exec } from "pkg";

const temp = "/tmp/";

export const pkgService = async () => {
  const fn = generateFileName("temp", ".cjs");

  const cwd = process.cwd();
  console.log(cwd);

  const tempFile = cwd + temp + fn;
  const tempDest = cwd + temp + "/test.exe";

  fs.writeFileSync(tempFile, testApp, "utf8");

  await exec([tempFile, "--target", "node14", "--output", tempDest]);

  const stream = fs.createReadStream(tempDest);
  stream.on("end", () => {
    fs.unlinkSync(tempFile);
    fs.unlinkSync(tempDest);
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
