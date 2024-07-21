import {
  installDependenciesString,
  installDevDependenciesString,
} from "../script-gen/scriptGenHelpers.js";

const generateCliCommands = (scriptRequest) => {
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
