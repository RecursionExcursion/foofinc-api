const execute = (command) => `execute('${command}');`;

const createDir = (dirPath) => `createDir('${dirPath}');`;

const writeFile = (filePath, content) =>
  `writeFile('${filePath}', \`${content}\`);`;

const readFile = (filePath) => `readFile('${filePath}');`;

export default {
  execute,
  createDir,
  writeFile,
  readFile,
};
