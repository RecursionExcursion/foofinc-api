import fs from "fs";
import Script from "../script-builder/Script.js";
import { execute } from "./scriptActions.js";
import { PRE_SCRIPTS } from "../../constants/paths.js";

// /pre-scripts/actionImports.cjs
// export const actionImports = () => {

// };
// export const actionImports = () => {
//   return fs.readFileSync(PRE_SCRIPTS + "/actionImports.cjs", "utf8");
// };

// export const executors = () => {
//   return fs.readFileSync(PRE_SCRIPTS + "/executors.cjs", "utf8");
// };

export const addPackageJsonScripts = (scriptMap) => {
  const script = new Script();

  const scriptsString = `const scripts = new Map([
            ${Array.from(scriptMap)
              .map(([key, value]) => `["${key}", "${value}"]`)
              .join(",\n")}
          ]);`;

  script.writeLine(scriptsString);
  //Script to add scripts to package.json
  script.writeLine(fs.readFileSync(PRE_SCRIPTS + "/addScripts.cjs", "utf8"));
  //Calling the script-generation logic in the script
  script.writeLine("addScripts(scripts);");

  return script;
};

export const installDependenciesScript = (dependencies) => {
  return execute(installDependenciesString(dependencies));
};

export const installDependenciesString = (dependencies) => {
  return `npm i -S ${dependencies.join(" ")}`;
};

export const installDevDependenciesScript = (devDependencies) => {
  return execute(installDevDependenciesString(devDependencies));
};

export const installDevDependenciesString = (devDependencies) => {
  return `npm i -D ${devDependencies.join(" ")}`;
};
