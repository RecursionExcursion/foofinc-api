import logger from "../../../lib/logger";
import createNodeSea from "../lib/node-sea/node-sea";
import zlib from "zlib";

export const pkgService = async () => {
  try {
    const seaExeStream = createNodeSea({
      fileName: "test",
      fileContent: testApp,
      tempDir: "temp",
      binDir: "sea-bin",
    });

    if (!seaExeStream) return;

    return seaExeStream.pipe(zlib.createGzip());
  } catch (e) {
    const error = e as Error;
    logger(error.message, "error");
    return;
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
