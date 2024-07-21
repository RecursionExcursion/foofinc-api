import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  { languageOptions: { globals: globals.node } },
  { ignores: ["node_modules/*", "build/*", "pre-scripts/*"] },
  pluginJs.configs.recommended,
];
