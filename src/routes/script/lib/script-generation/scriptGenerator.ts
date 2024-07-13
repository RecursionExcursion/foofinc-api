// import generateExpressScript from "../templates/express";
import { ScriptRequest } from "../../types/scriptRequest";
import { generateGenericScript } from "./genericScriptGenerator";
import uglify from "uglify-js";

export type ScriptGenResponse = {
  sucess: boolean;
  text: string;
};

type ScriptGenMap = Map<
  string,
  (scriptRequest: ScriptRequest) => ScriptGenResponse
>;

const scriptGeneratorMap: ScriptGenMap = new Map([
  // ["express", generateExpressScript],
  ["generic", generateGenericScript],
]);

export default function generateScript(
  scriptRequest: ScriptRequest
): ScriptGenResponse {
  const { prebuildType } = scriptRequest;

  const func =
    scriptGeneratorMap.get(prebuildType ?? "") ?? generateGenericScript;

  const resp = func(scriptRequest);

  if (resp.sucess) {
    const script = resp.text;
    const minifiedScript = uglify.minify(script).code;
    resp.text = minifiedScript;
  }

  return resp;
}
