import generateCliCommands from "../lib/command-generators/commandGenerator.js";
import generateScript from "../lib/script-generators/scriptGenerator.js";

//Use ts here to ensure the keys are the same as ScriptRequest
//TODO make dyanimc so it pulls from builds.ts
const expectedStructure = {
  prebuildType: `express`,
  build: `<runtime>-<framework>`,
  prodDependencies: "string[]",
  devDependencies: "string[]",
  scripts: "Map<string, string>",
  envVars: "Map<string, string>",
};

/**
 *@typedef {Object} ScriptServiceResponse
 *@property {boolean} success
 *@property {{ script:string; fileName:string }} [fileData]
 *@property {string[]} [cliCommands]
 *@property {unknown} [additionalData]
 */

/** @param {ScriptRequest} scriptRequest @returns {ScriptServiceResponse} */
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

/** @param {ScriptRequest} scriptRequest @returns {ScriptServiceResponse} */
const createCliCommands = (scriptRequest) => {
  if (!checkIfRequestIsValid(scriptRequest)) {
    return { success: false, additionalData: expectedStructure };
  }

  const commands = generateCliCommands(scriptRequest);

  return { success: true, cliCommands: commands };
};

/**
 * @param {ScriptRequest} scriptRequest
 * @returns {boolean}
 */
const checkIfRequestIsValid = (scriptRequest) => {
  return Object.values(scriptRequest).some((val) => val !== undefined);
};

const scriptService = {
  createScript,
  createCliCommands,
};

export default scriptService;
