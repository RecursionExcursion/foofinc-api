import extensions from "../../add-ons/addOns.js";
import { builds, runtimes } from "../../builds.js";
import { execute } from "../../script-gen/scriptActions.js";

const addBuild = ({ builder, request }) => {
  if (!request.build) {
    return { builder, request };
  }

  const [runtime, framework] = request.build.toLowerCase().split("-");

  if (!(runtime in runtimes)) {
    throw new Error(`Invalid runtime: ${runtime}`);
  }

  if (runtime === "node") {
    builder.addExtension(extensions.node({ priority: 0 }));
  }

  if (framework) {
    const frameworkBuild = builds.find(
      (build) => build.framework === framework
    );

    if (!frameworkBuild || frameworkBuild.runtime !== runtime) {
      throw new Error(`Invalid framework: ${framework}`);
    }

    if (frameworkBuild.cliCommand) {
      builder.addLine({
        text: execute(frameworkBuild.cliCommand),
        priority: 1,
      });
    }

    if (frameworkBuild.prodDependencies) {
      request.prodDependencies?.push(...frameworkBuild.prodDependencies);
      request.prodDependencies = Array.from(new Set(request.prodDependencies));
    }

    if (frameworkBuild.devDependencies) {
      request.devDependencies?.push(...frameworkBuild.devDependencies);
      request.devDependencies = Array.from(new Set(request.devDependencies));
    }
  }

  return { builder, request };
};

const addProdDependencies = ({ builder, request }) => {
  if (request.prodDependencies && request.prodDependencies.length) {
    builder.addDependencies(...request.prodDependencies);
  }
  return { builder, request };
};

const addDevDependencies = ({ builder, request }) => {
  if (request.devDependencies && request.devDependencies.length) {
    builder.addDevDependencies(...request.devDependencies);
  }
  return { builder, request };
};

const addScripts = ({ builder, request }) => {
  if (request.scripts) {
    builder.addScriptMap(request.scripts);
  }
  return { builder, request };
};

const addEnvVars = ({ builder, request }) => {
  if (request.envVars) {
    builder.addExtension(extensions.env(request.envVars));
  }
  return { builder, request };
};

const scriptGenPipe =
  (...fns) =>
  (params) =>
    fns.reduce((acc, fn) => fn(acc), params);

const genericScriptPipe = (params) => {
  return scriptGenPipe(
    addBuild,
    addProdDependencies,
    addDevDependencies,
    addScripts,
    addEnvVars
  )(params);
};

export default genericScriptPipe;
