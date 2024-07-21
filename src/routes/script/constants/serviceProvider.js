import { builds } from "../lib/builds.js";

const createRuntimeServices = (builds) => {
  const nodeService = {
    runtime: "Node.js",
    libraries: [],
  };

  const browserService = {
    runtime: "Browser",
    libraries: [],
  };

  builds.forEach((build) => {
    if (build.runtime === "node") {
      build
      nodeService.libraries.push(build.framework);
    }
    if (build.runtime === "browser") {
      browserService.libraries.push(build.framework);
    }
  });

  const services = [{ ...browserService }, { ...nodeService }];

  return services;
};

const packageManagers = ["npm"];

const services = createRuntimeServices(builds);

const templates = [];

const supportedServices = {
  packageManagers,
  services,
  templates,
};

export default supportedServices;
