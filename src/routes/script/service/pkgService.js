import zlib from "zlib";
import path from "path";
import logger from "../../../lib/logger.js";
import createNodeSea from "../lib/node-sea/node-sea.js";

export const pkgService = async () => {
  try {
    const seaExeStream = await createNodeSea({
      fileName: "test",
      fileContent: testApp,
      targetSig: "win",
      binDir: path.join(process.cwd(), "sea-bin"),
    });

    if (!seaExeStream) return;

    return seaExeStream.pipe(zlib.createGzip());
  } catch (e) {
    logger(e.message, "error");
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
