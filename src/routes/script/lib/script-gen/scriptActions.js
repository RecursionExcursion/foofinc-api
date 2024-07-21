export const scriptActionImport = `
  const execSync = require("child_process").execSync;
  const fs = require("fs");
  `;

export const execute = (command) => {
  return `execSync(\`${command}\`, { stdio: "inherit" })`;
};

export const createDir = (dirPath) => {
  return `fs.mkdirSync("${dirPath}")`;
};

export const writeFile = (filePath, content) => {
  return `fs.writeFileSync(\`${filePath}\`, \`${content}\`)`;
};

export const readFile = (filePath) => {
  return `fs.readFileSync("${filePath}", "utf8")`;
};
