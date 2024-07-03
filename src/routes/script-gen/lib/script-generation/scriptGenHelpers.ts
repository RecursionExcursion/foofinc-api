import fs from "fs";
import Script from "./Script";
import transcriber from "./transcriber";
import { PRE_SCRIPTS } from "../../constants/paths";

export const executors = () =>
  fs.readFileSync(PRE_SCRIPTS + "/executors.cjs", "utf8");

export const addPackageJsonScripts = (scriptMap: Map<string, string>) => {
  const script = new Script();

  const scriptsString = `const scripts = new Map([
            ${Array.from(scriptMap)
              .map(([key, value]) => `["${key}", "${value}"]`)
              .join(",\n")}
          ]);`;

  script.addLine(scriptsString);
  script.addLine(fs.readFileSync(PRE_SCRIPTS + "/addScripts.cjs", "utf8"));
  script.addLine("addScripts(scripts);");

  return script;
};

export const installDependencies = (dependencies: string[]) =>
  transcriber.execute(`npm i -S ${dependencies.join(" ")}`);

export const installDevDependencies = (devDependencies: string[]) =>
  transcriber.execute(`npm i -D ${devDependencies.join(" ")}`);
