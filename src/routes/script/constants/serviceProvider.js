import { builds } from "../lib/builds.js";
/**
 *@typedef {Object} Build
 *@property {string} runtime - Runtime of the build
 *@property {string[]} libraries - Framework of the build
 */

const createRuntimeServices = (builds) => {
  
  /** @type {Build} */
  const nodeService = {
    runtime: "Node.js",
    libraries: [],
  };

  /** @type {Build} */
  const browserService = {
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

const templates = [];

/**
 * @type {{
 *   packageManagers: string[],
 *   services: Object[],
 *   templates: string[]
 * }}
 */
const supportedServices = {
  packageManagers,
  services,
  templates,
};

export default supportedServices;
