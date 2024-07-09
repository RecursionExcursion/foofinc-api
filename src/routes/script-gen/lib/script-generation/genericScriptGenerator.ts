import { ScriptRequest } from "../../types/scriptRequest";
import extensions from "../extensions/extensions";
import { ScriptBuilder } from "./ScriptBuilder";

export const generateGenericScript = (scriptRequest: ScriptRequest): string => {
  const scriptBuilder = new ScriptBuilder();

  scriptBuilder.addExtension(extensions.gitIgnore({ priority: 10 }));
  scriptBuilder.addExtension(extensions.node({ priority: 0 }));

  if (scriptRequest.prodDependencies) {
    scriptBuilder.addDependencies(...scriptRequest.prodDependencies);
  }

  if (scriptRequest.devDependencies) {
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
