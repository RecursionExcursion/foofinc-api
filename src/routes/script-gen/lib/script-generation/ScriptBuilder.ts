import { Extension } from "../../types/extension";
import Script from "./Script";
import {
  actionImports,
  addPackageJsonScripts,
  installDependencies,
  installDevDependencies,
} from "./scriptGenHelpers";

const dependencyPriority = 2;

export class ScriptBuilder {
  private _script: Script;
  private extensions: Extension[] = [];

  private dependencies: string[] = [];
  private devDependencies: string[] = [];

  private scripts: Map<string, string> = new Map();
  private lines: string[] = [];

  constructor() {
    this._script = new Script();
    this._script.addLine(actionImports());
  }

  addExtension = (extension: Extension) => this.extensions.push(extension);

  addScript = (script: { key: string; value: string }) => {
    this.scripts.set(script.key, script.value);
  };

  addScriptMap = (scriptMap: Map<string, string>) => {
    Object.entries(scriptMap).forEach(([key, value]) => {
      this.scripts.set(key, value);
    });
  };

  addDependencies = (...dependencies: string[]) => {
    this.dependencies.push(...dependencies);
  };

  addDevDependencies = (...devDependencies: string[]) => {
    this.devDependencies.push(...devDependencies);
  };

  addLine = (line: string) => {
    this.lines.push(line);
  };

  build() {
    this.mapExtensionsToFields(this.extensions);
    return this.writeToScript(this._script, this.extensions);
  }

  private mapExtensionsToFields = (extensions: Extension[]) => {
    extensions.forEach((extension) => {
      if (extension.dependencies)
        this.dependencies.push(...extension.dependencies);

      if (extension.devDependencies)
        this.devDependencies.push(...extension.devDependencies);

      if (extension.additionalExecutions)
        this.lines.push(...extension.additionalExecutions);
    });
  };

  private writeToScript = (script: Script, extensions: Extension[]) => {
    const scriptCopy = Object.create(
      Object.getPrototypeOf(script),
      Object.getOwnPropertyDescriptors(script)
    );

    console.log({ extensions });

    extensions.sort((a, b) => {
      const priorityA =
        a.priority !== undefined ? a.priority : Number.MAX_SAFE_INTEGER;
      const priorityB =
        b.priority !== undefined ? b.priority : Number.MAX_SAFE_INTEGER;
      return priorityA - priorityB;
    });

    console.log({ extensions });

    const isBeforeDependencies = (priority: number | undefined) => {
      if (!priority) return false;
      priority <= dependencyPriority;
    };

    extensions
      .filter((extension) => isBeforeDependencies(extension.priority))
      .forEach((extension) => {
        console.log("writing", extension.script);

        if (extension.script) scriptCopy.addLine(extension.script);
      });

    scriptCopy.addLine(installDependencies(this.dependencies));
    scriptCopy.addLine(installDevDependencies(this.devDependencies));

    extensions
      .filter((extension) => !isBeforeDependencies(extension.priority))
      .forEach((extension) => {
        if (extension.script) scriptCopy.addLine(extension.script);
      });

    if (this.scripts.size > 0)
      scriptCopy.mergeScript(addPackageJsonScripts(this.scripts));

    this.lines.forEach((line) => scriptCopy.addLine(line));

    return scriptCopy;
  };
}
