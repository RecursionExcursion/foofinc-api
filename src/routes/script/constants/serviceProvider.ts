import { Build, builds } from "../lib/builds";

type Service = {
  runtime: string;
  libraries: string[];
};

const createRuntimeServices = (builds: Build[]): Service[] => {
  const nodeService: Service = {
    runtime: "Node.js",
    libraries: [],
  };

  const browserService: Service = {
    runtime: "Browser",
    libraries: [],
  };

  builds.forEach((build) => {
    if (build.runtime === "node") {
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

const templates: string[] = [];

const supportedServices = {
  packageManagers,
  services,
  templates,
};

export default supportedServices;
