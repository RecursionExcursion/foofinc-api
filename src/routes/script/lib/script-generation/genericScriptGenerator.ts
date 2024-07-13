import { ScriptRequest } from "../../types/scriptRequest";
import extensions from "../add-ons/addOns";
import { runtimes } from "../builds";
import { ScriptBuilder } from "./ScriptBuilder";
import { ScriptGenResponse } from "./scriptGenerator";
// import { builds } from "../builds";

export const generateGenericScript = (
  scriptRequest: ScriptRequest
): ScriptGenResponse => {
  const scriptBuilder = new ScriptBuilder();

  if (scriptRequest.build) {
    const [runtime, framework] = scriptRequest.build.split("-");

    if (runtime in runtimes) {
      console.log(runtime, framework);
    } else {
      return {
        sucess: false,
        text: `Invalid runtime: ${runtime}`,
      };
    }

    if (runtime === "node") {
      scriptBuilder.addExtension(extensions.node({ priority: 0 }));
    }
  }

  if (scriptRequest.prodDependencies && scriptRequest.prodDependencies.length) {
    scriptBuilder.addDependencies(...scriptRequest.prodDependencies);
  }

  if (scriptRequest.devDependencies && scriptRequest.devDependencies.length) {
    scriptBuilder.addDevDependencies(...scriptRequest.devDependencies);
  }

  if (scriptRequest.scripts) {
    scriptBuilder.addScriptMap(scriptRequest.scripts);
  }

  if (scriptRequest.envVars) {
    scriptBuilder.addExtension(extensions.env(scriptRequest.envVars));
  }

  return {
    sucess: true,
    text: scriptBuilder.build().script,
  };
};

// const foo = {
//   node: "node",
//   browser: "browser",
// } as const;

// type JsRuntime = keyof typeof foo;

// const runtime: string = "someValue"; // Replace this with your actual runtime source

// if (runtime in foo) {
//   const jsRuntime = runtime as JsRuntime;
//   console.log(jsRuntime, framework);
// } else {
//   console.error(`Invalid runtime: ${runtime}`);
// }
