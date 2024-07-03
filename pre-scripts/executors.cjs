/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */

const execSync = require("child_process").execSync;
const fs = require("fs");

/** @param {string} command */
const execute = (command) => execSync(command, { stdio: "inherit" });

/** @param {string} dirPath */
const createDir = (dirPath) => fs.mkdirSync(dirPath);

/** @param {string} filePath @param {string} content */
const writeFile = (filePath, content) => fs.writeFileSync(filePath, content);

/** @param {string} filePath @returns {string} */
const readFile = (filePath) => fs.readFileSync(filePath, "utf8");
