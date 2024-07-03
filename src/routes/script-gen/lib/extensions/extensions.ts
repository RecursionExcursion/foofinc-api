import { PRE_SCRIPTS } from "../../constants/paths";
import { Extension } from "../../types/extension";
import transcriber from "../script-generation/transcriber";
import fs from "fs";

type ExtensionParams = {
  priority?: number;
};

const node = (params?: ExtensionParams): Extension => {
  return {
    script: transcriber.execute("npm init -y"),
    priority: params?.priority,
  };
};

type ParamsWithTs = ExtensionParams & {
  ts: boolean;
};
const eslint = (params: ParamsWithTs): Extension => {
  const { ts } = params;

  const devDependencies = ["eslint", "@eslint/js"];
  if (ts) devDependencies.push("typescript-eslint");

  const additionalExecutions = [];
  additionalExecutions.push(
    transcriber.writeFile(
      ".eslintignore",
      `node_modules
      build`
    )
  );

  return {
    script: transcriber.execute("npm init @eslint/config"),
    devDependencies,
    additionalExecutions,
    priority: params?.priority,
  };
};

const tsc = (params?: ExtensionParams): Extension => {
  return {
    script: transcriber.execute("npx tsc --init"),
    priority: params?.priority,
    additionalExecutions: [
      transcriber.writeFile(
        "./tsconfig.json",
        fs.readFileSync(PRE_SCRIPTS + "/files/express/tsconfig.json", "utf8")
      ),
    ],
    devDependencies: ["typescript", "ts-node"],
  };
};

const env = (
  envVars: Map<string, string>,
  params?: ExtensionParams
): Extension => {
  const vars = Array.from(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  return {
    script: transcriber.writeFile(".env", vars),
    priority: params?.priority,
  };
};

const express = (params: ParamsWithTs): Extension => {
  const { ts } = params;

  const devDependencies = [];
  if (ts) devDependencies.push("@types/express");

  return {
    script: "",
    dependencies: ["express", "dotenv"],
    devDependencies,
    priority: params?.priority,
  };
};

const gitIgnore = (params?: ExtensionParams): Extension => {
  return {
    script: transcriber.writeFile(
      ".gitignore",
      fs.readFileSync(PRE_SCRIPTS + "/files/express/gitIgnore.txt", "utf8")
    ),
    priority: params?.priority,
  };
};

const nodemon = (params?: ExtensionParams): Extension => {
  return {
    script: transcriber.writeFile(
      "nodemon.json",
      fs.readFileSync(PRE_SCRIPTS + "/files/express/nodemon.json", "utf8")
    ),
    devDependencies: ["nodemon"],
    priority: params?.priority,
  };
};

const srcDir = (params?: ExtensionParams): Extension => {
  return {
    script: transcriber.createDir("./src"),
    priority: params?.priority,
  };
};

export default { node, eslint, tsc, env, express, gitIgnore, nodemon, srcDir };
