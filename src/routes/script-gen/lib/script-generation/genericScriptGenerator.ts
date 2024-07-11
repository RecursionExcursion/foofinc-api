import { ScriptRequest } from "../../types/scriptRequest";
import extensions from "../add-ons/addOns";
import { ScriptBuilder } from "./ScriptBuilder";

export const generateGenericScript = (scriptRequest: ScriptRequest): string => {
  const scriptBuilder = new ScriptBuilder();

  if (
    scriptRequest.prodDependencies &&
    scriptRequest.prodDependencies.length > 0
  ) {
    scriptBuilder.addDependencies(...scriptRequest.prodDependencies);
  }

  if (
    scriptRequest.devDependencies &&
    scriptRequest.devDependencies.length > 0
  ) {
    scriptBuilder.addDevDependencies(...scriptRequest.devDependencies);
  }

  if (scriptRequest.scripts) {
    scriptBuilder.addScriptMap(scriptRequest.scripts);
  }

  if (scriptRequest.envVars) {
    scriptBuilder.addExtension(extensions.env(scriptRequest.envVars));
  }

  return scriptBuilder.build().script;
};
