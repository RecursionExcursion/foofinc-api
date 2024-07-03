import generateScript from "./lib/script-generation/scriptGenerator";
import { ScriptType } from "./types/scriptType";
import { v4 as uuidv4 } from "uuid";

const scriptService = {
  generateScript: (type: ScriptType) => {
    const script = generateScript(type);

    const prefix = `${type}-${uuidv4().split("-")[0]}`;
    const filetype = ".cjs";

    const fileName = prefix + filetype;

    return { script, fileName };
  },
};

export default scriptService;
