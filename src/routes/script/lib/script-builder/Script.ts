export default class Script {
  private lines: string[] = [];

  writeLine(line: string) {
    this.lines.push(line);
  }

  mergeScript(otherScript: Script) {
    otherScript.readLines().forEach((line) => this.writeLine(line));
  }

  readLines() {
    return this.lines;
  }

  get script() {
    return this.lines.join("\n");
  }
}
