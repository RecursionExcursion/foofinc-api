import { generateGenericScript } from "./generic/genericScriptGen.js";
import uglify from "uglify-js";
import { v4 as uuidv4 } from "uuid";

const prefix = `easy-node-`;
const filetype = ".cjs";

const scriptGeneratorMap = new Map([
  // ["express", generateExpressScript],
  ["generic", generateGenericScript],
]);

export default function generateScript(scriptRequest) {
  const { prebuildType } = scriptRequest;

  const scriptGenerator =
    scriptGeneratorMap.get(prebuildType ?? "") ?? generateGenericScript;

  const resp = scriptGenerator(scriptRequest);

  console.log(resp);

  if (resp.success) {
    resp.text = minifyScript(resp.text);
    resp.fileName = generateFileName(prefix, filetype);
  }

  return resp;
}

const minifyScript = (script) => uglify.minify(script).code;

export const generateFileName = (prefix, filetype) => {
  const id = uuidv4().split("-")[0];
  return [prefix, id].join("-") + filetype;
};
