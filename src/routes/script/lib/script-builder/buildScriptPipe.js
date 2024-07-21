import {
  addPackageJsonScripts,
  installDependenciesScript,
  installDevDependenciesScript,
} from "../script-gen/scriptGenHelpers.js";

const sortByPriority = (params) => {
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

const writeBeforeDepLines = (params) => {
  const dependencyPriority = params.dependencyPriority;

  params.priorityArray
    .filter((p) => isBeforeDependencies(p, dependencyPriority))
    .forEach((priorityObj) => {
      assignLineExtension(priorityObj, params.script);
    });
  return params;
};

const installDependencies = (params) => {
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

const writeAfterDepLines = (params) => {
  const dependencyPriority = params.dependencyPriority;

  params.priorityArray
    .filter((p) => !isBeforeDependencies(p, dependencyPriority))
    .forEach((priorityObj) => {
      assignLineExtension(priorityObj, params.script);
    });
  return params;
};

const addNpmScriptsToScript = (params) => {
  const scripts = params.builder.getScripts();

  if (scripts.size > 0) {
    params.script.mergeScript(addPackageJsonScripts(scripts));
  }
  return params;
};

const isExtension = (obj) => {
  return (
    obj.script !== undefined ||
    obj.devDependencies !== undefined ||
    obj.dependencies !== undefined ||
    obj.additionalExecutions !== undefined
  );
};

const isLine = (obj) => {
  return obj.text !== undefined;
};

const isBeforeDependencies = (extension, dependencyPriority) => {
  if (extension.priority === undefined) return false;
  return extension.priority <= dependencyPriority;
};

const assignLineExtension = (lineExt, script) => {
  if (isExtension(lineExt)) {
    if (lineExt.script) script.writeLine(lineExt.script);
    return;
  }

  if (isLine(lineExt)) {
    script.writeLine(lineExt.text);
  }
};

const scriptBuilderPipe =
  (...fns) =>
  (params) =>
    fns.reduce((acc, fn) => fn(acc), params);

const buildScriptPipe = (params) => {
  return scriptBuilderPipe(
    sortByPriority,
    writeBeforeDepLines,
    installDependencies,
    writeAfterDepLines,
    addNpmScriptsToScript
  )(params);
};

export default buildScriptPipe;
