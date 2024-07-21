import { ScriptBuilder } from "../../script-builder/ScriptBuilder.js";
import genericScriptPipe from "./genericScriptPipe.js";

export const generateGenericScript = (request) => {
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
      text: e.message,
    };
  }
};
