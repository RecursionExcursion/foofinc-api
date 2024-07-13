export type PrebuildScriptType = "express";

export type ScriptFramework = "node" | "react" | "next";

export type ScriptRequest = {
  prebuildType?: PrebuildScriptType;
  build?: string;
  scripts?: Map<string, string>;
  prodDependencies?: string[];
  devDependencies?: string[];
  envVars?: Map<string, string>;
};

type NonOptionalFields<T, t> = {
  [K in keyof T]-?: t;
};

export type ScriptRequestDescription = NonOptionalFields<ScriptRequest, string>;
