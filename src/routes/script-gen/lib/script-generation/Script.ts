export default class Script {
  private lines: string[] = [];

  constructor() {}

  addLine(line: string) {
    this.lines.push(line);
  }

  mergeScript(otherScript: Script) {
    otherScript.getLines().forEach((line) => this.addLine(line));
  }

  getLines() {
    return this.lines;
  }

  get script() {
    return this.lines.join("\n");
  }
}
