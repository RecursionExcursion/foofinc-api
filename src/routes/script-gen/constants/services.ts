const packageManagers = ["npm"];

type Service = {
  runtime: string;
  libraries: string[];
};

const nodeService: Service = {
  runtime: "Node.js",
  libraries: [],
};

const browserService: Service = {
  runtime: "Browser",
  libraries: ["React", "Next.js"],
};

const templates: string[] = [];

const supportedServices = {
  supportedPackageManagers: packageManagers,
  nodeService,
  browserService,
  templates,
};

export default supportedServices;
