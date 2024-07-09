import extensions from "./extensions/extensions";
import { ScriptBuilder } from "./script-generation/ScriptBuilder";
import { PRE_SCRIPTS } from "../constants/paths";
import fs from "fs";
import { writeFile } from "./script-generation/actions/scriptActions";

export default function generateExpressScript(): string {
  const dependencies: string[] = [];
  const devDependencies: string[] = [];

  const PORT = 8080;
  const envVars = new Map<string, string>();
  envVars.set("PORT", `${PORT}`);

  const scripts = new Map([
    ["dev", "nodemon"],
    ["build", "tsc"],
  ]);

  const scriptBuilder = new ScriptBuilder();

  scripts.forEach((value, key) => scriptBuilder.addScript({ key, value }));
  scriptBuilder.addDependencies(...dependencies);
  scriptBuilder.addDevDependencies(...devDependencies);

  scriptBuilder.addExtension(extensions.node({ priority: 0 }));
  scriptBuilder.addExtension(extensions.express({ ts: true }));
  scriptBuilder.addExtension(extensions.tsc({ priority: 3 }));
  scriptBuilder.addExtension(extensions.eslint({ ts: true, priority: 3 }));

  scriptBuilder.addExtension(extensions.env(envVars));
  scriptBuilder.addExtension(extensions.gitIgnore());
  scriptBuilder.addExtension(extensions.srcDir());

  scriptBuilder.addLine(
    writeFile(
      "./src/index.ts",
      fs.readFileSync(PRE_SCRIPTS + "/files/express/index.ts.txt", "utf8") //TODO: Fix this on vercel, does not load route from .ts file
    )
  );

  return scriptBuilder.build().script;
}
