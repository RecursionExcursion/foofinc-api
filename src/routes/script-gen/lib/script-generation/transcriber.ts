const execute = (command: string) => `execute('${command}');`;

const createDir = (dirPath: string) => `createDir('${dirPath}');`;

const writeFile = (filePath: string, content: string) =>
  `writeFile('${filePath}', \`${content}\`);`;

const readFile = (filePath: string) => `readFile('${filePath}');`;

export default {
  execute,
  createDir,
  writeFile,
  readFile,
};
