export type Package = {
  name: string;
  version?: string;
  eslint?: boolean;
  boilerplate?: boolean;
  tsTypes?: string;
  priority?: number;
};
