import { ScriptRequest } from "../../types/scriptRequest";
import extensions from "../add-ons/addOns";
import { runtimes } from "../builds";
import { ScriptBuilder } from "../script-gen/ScriptBuilder";
import { ScriptGenResponse } from "./scriptGenerator";
import { builds } from "../builds";
import { execute } from "../script-gen/scriptActions";

export const generateGenericScript = (
  scriptRequest: ScriptRequest
): ScriptGenResponse => {
  let builder;
  let request;

  try {
    const { builder: newBuilder, request: req } = addBuild(
      new ScriptBuilder(),
      scriptRequest
    );
    builder = newBuilder;
    request = req;
  } catch (e: unknown) {
    const msg = (e as Error).message;
    return {
      success: false,
      text: msg,
    };
  }

  if (request.prodDependencies && request.prodDependencies.length) {
    builder.addDependencies(...request.prodDependencies);
  }

  if (request.devDependencies && request.devDependencies.length) {
    builder.addDevDependencies(...request.devDependencies);
  }

  if (request.scripts) {
    builder.addScriptMap(request.scripts);
  }

  if (request.envVars) {
    builder.addExtension(extensions.env(request.envVars));
  }

  return {
    success: true,
    text: builder.build().script,
  };
};

type AddBuildRespObj = {
  builder: ScriptBuilder;
  request: ScriptRequest;
};

const addBuild = (
  scriptBuilder: ScriptBuilder,
  initRequest: ScriptRequest
): AddBuildRespObj => {
  if (!initRequest.build) {
    return {
      builder: scriptBuilder,
      request: initRequest,
    };
  }

  // const scriptBuilder = structuredClone(initBuilder);
  const scriptRequest = structuredClone(initRequest);

  const [runtime, framework] = scriptRequest.build!.split("-");

  if (!(runtime in runtimes)) {
    throw new Error(`Invalid runtime: ${runtime}`);
  }

  if (runtime === "node") {
    scriptBuilder.addExtension(extensions.node({ priority: 0 }));
  }

  if (framework) {
    const frameworkBuild = builds.find(
      (build) => build.framework === framework
    );

    if (!frameworkBuild || frameworkBuild.runtime !== runtime) {
      throw new Error(`Invalid framework: ${framework}`);
    }

    if (frameworkBuild.cliCommand) {
      scriptBuilder.addLine({text:execute(frameworkBuild.cliCommand), priority: 1});
    }

    if (frameworkBuild.prodDependencies) {
      scriptRequest.prodDependencies?.push(...frameworkBuild.prodDependencies);
      scriptRequest.prodDependencies = Array.from(
        new Set(scriptRequest.prodDependencies)
      );
    }

    if (frameworkBuild.devDependencies) {
      scriptRequest.devDependencies?.push(...frameworkBuild.devDependencies);
      scriptRequest.devDependencies = Array.from(
        new Set(scriptRequest.devDependencies)
      );
    }
  }

  return {
    builder: scriptBuilder,
    request: scriptRequest,
  };
};
