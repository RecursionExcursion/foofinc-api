import { ScriptRequest } from "../../types/scriptRequest";
import {
  installDependenciesString,
  installDevDependenciesString,
} from "../script-gen/scriptGenHelpers";

const generateCliCommands = (scriptRequest: ScriptRequest): string[] => {
  const commands = [];

  if (scriptRequest.prodDependencies) {
    commands.push(installDependenciesString(scriptRequest.prodDependencies));
  }

  if (scriptRequest.devDependencies) {
    commands.push(installDevDependenciesString(scriptRequest.devDependencies));
  }

  // if (scriptRequest.framework) {
  //   //TODO: Add framework specific commands
  // }

  return commands;
};

export default generateCliCommands;
