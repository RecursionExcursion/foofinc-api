export const runtimes = {
  node: "node",
  browser: "browser",
};

const react = {
  framework: "react",
  cliCommand: "npx create-react-app",
  runtime: "browser",
};

const nextJs = {
  framework: "next",
  cliCommand: "npx create-next-app",
  runtime: "browser",
};

const electron = {
  framework: "electron",
  prodDependencies: [],
  devDependencies: ["electron"],
  runtime: "node",
};

export const builds = [react, nextJs, electron];
