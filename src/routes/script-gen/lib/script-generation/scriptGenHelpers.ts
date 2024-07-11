import fs from "fs";
import Script from "./Script";
import { PRE_SCRIPTS } from "../../constants/paths";
import { execute } from "./actions/scriptActions";

export const actionImports = () => {
  return fs.readFileSync(PRE_SCRIPTS + "/actionImports.cjs", "utf8");
};

export const executors = () => {
  return fs.readFileSync(PRE_SCRIPTS + "/executors.cjs", "utf8");
};

export const addPackageJsonScripts = (scriptMap: Map<string, string>) => {
  const script = new Script();

  const scriptsString = `const scripts = new Map([
            ${Array.from(scriptMap)
              .map(([key, value]) => `["${key}", "${value}"]`)
              .join(",\n")}
          ]);`;

  script.addLine(scriptsString);
  //Script to add scripts to package.json
  script.addLine(fs.readFileSync(PRE_SCRIPTS + "/addScripts.cjs", "utf8"));
  //Calling the script-generation logic in the script
  script.addLine("addScripts(scripts);");

  return script;
};

export const installDependenciesScript = (dependencies: string[]) => {
  execute(installDependenciesString(dependencies));
};

export const installDependenciesString = (dependencies: string[]) => {
  return `npm i -S ${dependencies.join(" ")}`;
};

export const installDevDependenciesScript = (devDependencies: string[]) => {
  execute(installDevDependenciesString(devDependencies));
};

export const installDevDependenciesString = (devDependencies: string[]) => {
  return `npm i -D ${devDependencies.join(" ")}`;
};
