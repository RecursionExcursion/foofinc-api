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

export const installDependencies = (dependencies: string[]) =>
  execute(`npm i -S ${dependencies.join(" ")}`);

export const installDevDependencies = (devDependencies: string[]) =>
  execute(`npm i -D ${devDependencies.join(" ")}`);
