import fs from "fs";
import { createDir, execute, writeFile } from "../script-gen/scriptActions.js";
import { PRE_SCRIPTS } from "../../constants/paths.js";

const node = (params) => {
  return {
    script: execute("npm init -y"),
    priority: params?.priority,
  };
};

const eslint = (params) => {
  const { ts } = params;

  const devDependencies = ["eslint", "@eslint/js"];
  if (ts) devDependencies.push("typescript-eslint");

  const additionalExecutions = [];
  additionalExecutions.push(
    writeFile(
      ".eslintignore",
      `node_modules
      build`
    )
  );

  return {
    script: execute("npm init @eslint/config"),
    devDependencies,
    additionalExecutions,
    priority: params?.priority,
  };
};

const tsc = (params) => {
  return {
    script: execute("npx tsc --init"),
    priority: params?.priority,
    additionalExecutions: [
      writeFile(
        "./tsconfig.json",
        fs.readFileSync(PRE_SCRIPTS + "/files/express/tsconfig.json", "utf8")
      ),
    ],
    devDependencies: ["typescript", "ts-node"],
  };
};

const env = (envVars, params) => {
  const vars = Array.from(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  return {
    script: writeFile(".env", vars),
    priority: params?.priority,
  };
};

const express = (params) => {
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

const gitIgnore = (params) => {
  return {
    script: writeFile(
      ".gitignore",
      fs.readFileSync(PRE_SCRIPTS + "/files/express/gitIgnore.txt", "utf8")
    ),
    priority: params?.priority,
  };
};

const nodemon = (params) => {
  return {
    script: writeFile(
      "nodemon.json",
      fs.readFileSync(PRE_SCRIPTS + "/files/express/nodemon.json", "utf8")
    ),
    devDependencies: ["nodemon"],
    priority: params?.priority,
  };
};

const srcDir = (params) => {
  return {
    script: createDir("./src"),
    priority: params?.priority,
  };
};

export default { node, eslint, tsc, env, express, gitIgnore, nodemon, srcDir };
