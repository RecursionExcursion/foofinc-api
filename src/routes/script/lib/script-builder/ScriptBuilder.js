import Script from "./Script.js";
import { scriptActionImport } from "../script-gen/scriptActions.js";
import buildScriptPipe from "./buildScriptPipe.js";

const dependencyPriority = 2;

// type Priority = number;

// export type Line = { text: string; priority?: Priority };

// export type Extension = {
//   script?: string;
//   devDependencies?: string[];
//   dependencies?: string[];
//   additionalExecutions?: string[];
//   priority?: Priority;
// };

export class ScriptBuilder {
  #_script;
  #extensions = [];

  #dependencies = [];
  #devDependencies = [];

  #scripts = new Map();
  #lines = [];

  constructor() {
    this.#_script = new Script();
    this.#_script.writeLine(scriptActionImport);
  }

  getProdDependencies = () => this.#dependencies;
  getDevDependencies = () => this.#devDependencies;
  getScripts = () => this.#scripts;

  addExtension = (extension) => this.#extensions.push(extension);

  addScript = (script) => {
    this.#scripts.set(script.key, script.value);
  };

  addScriptMap = (scriptMap) => {
    Object.entries(scriptMap).forEach(([key, value]) => {
      this.#scripts.set(key, value);
    });
  };

  addDependencies = (...dependencies) => {
    this.#dependencies.push(...dependencies);
  };

  addDevDependencies = (...devDependencies) => {
    this.#devDependencies.push(...devDependencies);
  };

  addLine = (line) => {
    this.#lines.push(line);
  };

  build() {
    this.#mapExtensionsToFields(this.#extensions);
    return this.#writeToScript(this.#_script, this.#extensions, this.#lines);
  }

  #mapExtensionsToFields = (extensions) => {
    extensions.forEach((extension) => {
      if (extension.dependencies)
        this.#dependencies.push(...extension.dependencies);

      if (extension.devDependencies)
        this.#devDependencies.push(...extension.devDependencies);

      if (extension.additionalExecutions) {
        extension.additionalExecutions.forEach((line) =>
          this.#lines.push({ text: line })
        );
      }
    });
  };

  #writeToScript = (script, extensions, lines) => {
    const scriptCopy = Object.create(
      Object.getPrototypeOf(script),
      Object.getOwnPropertyDescriptors(script)
    );

    const pipeParams = {
      script: scriptCopy,
      builder: this,
      priorityArray: [...extensions, ...lines],
      dependencyPriority,
    };

    const res = buildScriptPipe(pipeParams);

    return res.script;
  };
}
