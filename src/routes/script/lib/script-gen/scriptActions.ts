export const scriptActionImport = `
  const execSync = require("child_process").execSync;
  const fs = require("fs");
  `;

export const execute = (command: string) => {
  return `execSync(\`${command}\`, { stdio: "inherit" })`;
};

export const createDir = (dirPath: string) => {
  return `fs.mkdirSync("${dirPath}")`;
};

export const writeFile = (filePath: string, content: string) => {
  return `fs.writeFileSync(\`${filePath}\`, \`${content}\`)`;
};

export const readFile = (filePath: string) => {
  return `fs.readFileSync("${filePath}", "utf8")`;
};
