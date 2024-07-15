// import generateExpressScript from "../templates/express";
import { ScriptRequest } from "../../types/scriptRequest";
import { generateGenericScript } from "./genericScriptGenerator";
import uglify from "uglify-js";
import { v4 as uuidv4 } from "uuid";

export type ScriptGenResponse = {
  success: boolean;
  text: string;
  fileName?: string;
};

type ScriptGenMap = Map<
  string,
  (scriptRequest: ScriptRequest) => ScriptGenResponse
>;

const prefix = `easy-node-`;
const filetype = ".cjs";

const scriptGeneratorMap: ScriptGenMap = new Map([
  // ["express", generateExpressScript],
  ["generic", generateGenericScript],
]);

export default function generateScript(
  scriptRequest: ScriptRequest
): ScriptGenResponse {
  const { prebuildType } = scriptRequest;

  const scriptGenerator =
    scriptGeneratorMap.get(prebuildType ?? "") ?? generateGenericScript;

  const resp = scriptGenerator(scriptRequest);

  if (resp.success) {
    resp.text = minifyScript(resp.text);
    resp.fileName = generateFileName();
  }

  return resp;
}

const minifyScript = (script: string): string => uglify.minify(script).code;

const generateFileName = (): string => {
  const id = uuidv4().split("-")[0];
  return prefix + id + filetype;
};
