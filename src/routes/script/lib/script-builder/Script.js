export default class Script {
  #lines = [];

  writeLine(line) {
    this.#lines.push(line);
  }

  mergeScript(otherScript) {
    otherScript.readLines().forEach((line) => this.writeLine(line));
  }

  readLines() {
    return this.#lines;
  }

  get script() {
    return this.#lines.join("\n");
  }
}
