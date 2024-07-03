import { ScriptType } from "../../types/scriptType";
import generateExpressScript from "../express";

export default function generateScript(scriptType: ScriptType): string {
  switch (scriptType) {
    case "express":
      return generateExpressScript();
    default:
      return "";
  }
}
