/** @typedef {'node' | 'browser'} JsRuntime */

/**
 *@typedef {Object} Build
 *@property {string} framework - Framework of the build
 *@property {string} [cliCommand] - CLI command for the build
 *@property {string[]} [prodDependencies] - Production dependencies for the build
 *@property {string[]} [devDependencies] - Development dependencies for the build
 *@property {JsRuntime} [runtime] - Runtime of the build
 */

/** @type {Build} */
const react = {
  framework: "react",
  cliCommand: "npx create-react-app",
  runtime: "browser",
};

/** @type {Build} */
const nextJs = {
  framework: "next",
  cliCommand: "npx create-next-app",
  runtime: "browser",
};

/** @type {Build} */
const electron = {
  framework: "electron",
  prodDependencies: [],
  devDependencies: ["electron"],
  runtime: "node",
};

export const builds = [react, nextJs, electron];
