import extensions from "../add-ons/addOns.js";
import { ScriptBuilder } from "../script-builder/ScriptBuilder.js";

export default function generateExpressScript() {
  const dependencies = [];
  const devDependencies = [];

  const PORT = 8080;
  const envVars = new Map();
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

  // scriptBuilder.addLine(
  //   writeFile(
  //     "./src/index.ts",
  //     fs.readFileSync(PRE_SCRIPTS + "/files/express/index.ts.txt", "utf8") //TODO: Fix this on vercel, does not load route from .ts file
  //   )
  // );

  return scriptBuilder.build().script;
}
