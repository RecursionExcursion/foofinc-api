import generateCliCommands from "../lib/command-generators/commandGenerator.js";
import generateScript from "../lib/script-generators/scriptGenerator.js";

//Use ts here to ensure the keys are the same as ScriptRequest
//TODO make dyanimc so it pulls from builds.ts
const expectedStructure = {
  prebuildType: `express>`,
  build: `<runtime>-<framework>`,
  prodDependencies: "Array<string>",
  devDependencies: "Array<string>",
  scripts: "Map<string, string>",
  envVars: "Map<string, string>",
};

/**
*@param {ScriptRequest} scriptRequest
*@returns {}
*/
const createScript = (scriptRequest) => {
  if (!checkIfRequestIsValid(scriptRequest)) {
    return {
      success: false,
      additionalData: `Expected format- ${JSON.stringify(expectedStructure)}`,
    };
  }

  const resp = generateScript(scriptRequest);

  if (!resp.success) {
    return { success: false, additionalData: resp.text };
  }

  const script = resp.text;
  const fileName = resp.fileName ?? "script.cjs";

  return { success: true, fileData: { script, fileName } };
};

const createCliCommands = (scriptRequest) => {
  if (!checkIfRequestIsValid(scriptRequest)) {
    return { success: false, additionalData: expectedStructure };
  }

  const commands = generateCliCommands(scriptRequest);

  return { success: true, cliCommands: commands };
};

const checkIfRequestIsValid = (scriptRequest) => {
  return Object.values(scriptRequest).some((val) => val !== undefined);
};

const scriptService = {
  createScript,
  createCliCommands,
};

export default scriptService;
