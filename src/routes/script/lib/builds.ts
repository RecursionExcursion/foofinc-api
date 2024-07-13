export const runtimes = {
  node: "node",
  browser: "browser",
} as const;

export type JsRuntime = keyof typeof runtimes;

export type Build = {
  framework: string;
  cliCommand?: string;
  prodDependencies?: string[];
  devDependencies?: string[];
  runtime?: JsRuntime;
};

const react: Build = {
  framework: "react",
  cliCommand: "npx create-react-app",
  runtime: "browser",
};

const nextJs: Build = {
  framework: "next",
  cliCommand: "npx create-next-app",
  runtime: "browser",
};

const electron: Build = {
  framework: "electron",
  cliCommand: "npx create-electron-app",
  prodDependencies: [],
  devDependencies: ["electron"],
  runtime: "node",
};

export const builds = [react, nextJs, electron];
