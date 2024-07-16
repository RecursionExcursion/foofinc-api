import { ScriptRequest } from "../../../types/scriptRequest";

import { ScriptBuilder } from "../../script-builder/ScriptBuilder";
import { ScriptGenResponse } from "../scriptGenerator";
import genericScriptPipe from "./genericScriptPipe";

export const generateGenericScript = (
  request: ScriptRequest
): ScriptGenResponse => {
  try {
    const scriptPipe = genericScriptPipe({
      builder: new ScriptBuilder(),
      request,
    });

    return {
      success: true,
      text: scriptPipe.builder.build().script,
    };
  } catch (e) {
    return {
      success: false,
      text: (e as Error).message,
    };
  }
};
