import {
  addPackageJsonScripts,
  installDependenciesScript,
  installDevDependenciesScript,
} from "../script-gen/scriptGenHelpers";
import Script from "./Script";
import { Extension, Line, ScriptBuilder } from "./ScriptBuilder";

export type BuilderPipeParams = {
  script: Script;
  builder: ScriptBuilder;
  priorityArray: (Extension | Line)[];
  dependencyPriority: number;
};

const sortByPriority = (params: BuilderPipeParams) => {
  const arrayCopy = structuredClone(params.priorityArray);
  arrayCopy.sort((a, b) => {
    const priorityA =
      a.priority !== undefined ? a.priority : Number.MAX_SAFE_INTEGER;

    const priorityB =
      b.priority !== undefined ? b.priority : Number.MAX_SAFE_INTEGER;

    return priorityA - priorityB;
  });
  return {
    ...params,
    priorityArray: arrayCopy,
  };
};

const writeBeforeDepLines = (params: BuilderPipeParams) => {
  const dependencyPriority = params.dependencyPriority;

  params.priorityArray
    .filter((p) => isBeforeDependencies(p, dependencyPriority))
    .forEach((priorityObj) => {
      assignLineExtension(priorityObj, params.script);
    });
  return params;
};

const installDependencies = (params: BuilderPipeParams) => {
  const prodDependencies = params.builder.getProdDependencies();
  const devDependencies = params.builder.getDevDependencies();

  if (prodDependencies.length > 0) {
    params.script.writeLine(installDependenciesScript(prodDependencies));
  }

  if (devDependencies.length > 0) {
    params.script.writeLine(installDevDependenciesScript(devDependencies));
  }
  return params;
};

const writeAfterDepLines = (params: BuilderPipeParams) => {
  const dependencyPriority = params.dependencyPriority;

  params.priorityArray
    .filter((p) => !isBeforeDependencies(p, dependencyPriority))
    .forEach((priorityObj) => {
      assignLineExtension(priorityObj, params.script);
    });
  return params;
};

const addNpmScriptsToScript = (params: BuilderPipeParams) => {
  const scripts = params.builder.getScripts();

  if (scripts.size > 0) {
    params.script.mergeScript(addPackageJsonScripts(scripts));
  }
  return params;
};

const isExtension = (obj: Extension | Line): obj is Extension => {
  return (
    (obj as Extension).script !== undefined ||
    (obj as Extension).devDependencies !== undefined ||
    (obj as Extension).dependencies !== undefined ||
    (obj as Extension).additionalExecutions !== undefined
  );
};

const isLine = (obj: Extension | Line): obj is Line => {
  return (obj as Line).text !== undefined;
};

const isBeforeDependencies = (
  extension: Extension | Line,
  dependencyPriority: number
) => {
  if (extension.priority === undefined) return false;
  return extension.priority <= dependencyPriority;
};

const assignLineExtension = (lineExt: Extension | Line, script: Script) => {
  if (isExtension(lineExt)) {
    if (lineExt.script) script.writeLine(lineExt.script);
    return;
  }

  if (isLine(lineExt)) {
    script.writeLine(lineExt.text);
  }
};

type PipeFunc = (params: BuilderPipeParams) => BuilderPipeParams;

const scriptBuilderPipe =
  (...fns: PipeFunc[]) =>
  (params: BuilderPipeParams) =>
    fns.reduce((acc, fn) => fn(acc), params);

const buildScriptPipe = (params: BuilderPipeParams) => {
  return scriptBuilderPipe(
    sortByPriority,
    writeBeforeDepLines,
    installDependencies,
    writeAfterDepLines,
    addNpmScriptsToScript
  )(params);
};

export default buildScriptPipe;
