import Script from "./Script";
import { scriptActionImport } from "../script-gen/scriptActions";
import buildScriptPipe, { BuilderPipeParams } from "./buildScriptPipe";

const dependencyPriority = 2;

type Priority = number;

export type Line = { text: string; priority?: Priority };

export type Extension = {
  script?: string;
  devDependencies?: string[];
  dependencies?: string[];
  additionalExecutions?: string[];
  priority?: Priority;
};

export class ScriptBuilder {
  private _script: Script;
  private extensions: Extension[] = [];

  private dependencies: string[] = [];
  private devDependencies: string[] = [];

  private scripts: Map<string, string> = new Map();
  private lines: Line[] = [];

  constructor() {
    this._script = new Script();
    this._script.writeLine(scriptActionImport);
  }

  getProdDependencies = () => this.dependencies;
  getDevDependencies = () => this.devDependencies;
  getScripts = () => this.scripts;

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

  addLine = (line: Line) => {
    this.lines.push(line);
  };

  build() {
    this.mapExtensionsToFields(this.extensions);
    return this.writeToScript(this._script, this.extensions, this.lines);
  }

  private mapExtensionsToFields = (extensions: Extension[]) => {
    extensions.forEach((extension) => {
      if (extension.dependencies)
        this.dependencies.push(...extension.dependencies);

      if (extension.devDependencies)
        this.devDependencies.push(...extension.devDependencies);

      if (extension.additionalExecutions) {
        extension.additionalExecutions.forEach((line) =>
          this.lines.push({ text: line })
        );
      }
    });
  };

  private writeToScript = (
    script: Script,
    extensions: Extension[],
    lines: Line[]
  ) => {
    const scriptCopy: Script = Object.create(
      Object.getPrototypeOf(script),
      Object.getOwnPropertyDescriptors(script)
    );

    const pipeParams: BuilderPipeParams = {
      script: scriptCopy,
      builder: this,
      priorityArray: [...extensions, ...lines],
      dependencyPriority,
    };

    const res = buildScriptPipe(pipeParams);

    return res.script;
  };
}
