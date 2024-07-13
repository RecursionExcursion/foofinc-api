import { v4 as uuidv4 } from "uuid";
import { ScriptRequest, ScriptRequestDescription } from "../types/scriptRequest";
import generateScript from "../lib/script-generation/scriptGenerator";
import generateCliCommands from "../lib/cli-command-generation/commandGenerator";


type ScriptServicePayload = {
  success: boolean;
  fileData?: { script: string; fileName: string };
  cliCommands?: string[];
  additionalData?: unknown;
};

//Use ts here to ensure the keys are the same as ScriptRequest
//TODO make dyanimc so it pulls from builds.ts
const expectedStructure: ScriptRequestDescription = {
  prebuildType: `express>`,
  build: `<runtime>-<framework>`,
  prodDependencies: "Array<string>",
  devDependencies: "Array<string>",
  scripts: "Map<string, string>",
  envVars: "Map<string, string>",
};

const createScript = (scriptRequest: ScriptRequest): ScriptServicePayload => {
  if (!checkIfRequestIsValid(scriptRequest)) {
    return {
      success: false,
      additionalData: `Expected format- ${JSON.stringify(expectedStructure)}`,
    };
  }

  const resp = generateScript(scriptRequest);

  if (!resp.sucess) {
    return { success: false, additionalData: resp.text };
  }

  const script = resp.text;

  const prefix = `easy-node-${uuidv4().split("-")[0]}`;
  const filetype = ".cjs";

  const fileName = prefix + filetype;

  return { success: true, fileData: { script, fileName } };
};

const createCliCommands = (
  scriptRequest: ScriptRequest
): ScriptServicePayload => {
  if (!checkIfRequestIsValid(scriptRequest)) {
    return { success: false, additionalData: expectedStructure };
  }

  const commands = generateCliCommands(scriptRequest);

  return { success: true, cliCommands: commands };
};

const checkIfRequestIsValid = (scriptRequest: ScriptRequest): boolean => {
  return Object.values(scriptRequest).some((val) => val !== undefined);
};

const scriptService = {
  createScript,
  createCliCommands,
};

export default scriptService;
