import { ScriptRequest } from "../../types/scriptRequest";
import generateExpressScript from "../templates/express";
import { generateGenericScript } from "./genericScriptGenerator";

export default function generateScript(scriptRequest: ScriptRequest): string {
  const { prebuildType } = scriptRequest;

  if (prebuildType) {
    switch (prebuildType) {
      case "express":
        return generateExpressScript();
      default:
        return "";
    }
  }

  return generateGenericScript(scriptRequest);
}
