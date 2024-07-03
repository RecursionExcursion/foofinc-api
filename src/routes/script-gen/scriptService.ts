import { Header } from "../../types/RouteHandlerTypes";
import generateScript from "./lib/script-generation/scriptGenerator";
import { ScriptType } from "./types/scriptType";
import { v4 as uuidv4 } from "uuid";

const scriptService = {
  generateScript: (type: ScriptType) => {
    const script = generateScript(type);
    
    const fileName = `${type}-${uuidv4().split("-")[0]}`;
    const filetype = ".cjs";

    const headers: Header[] = [
      {
        key: "Content-Disposition",
        value: `attachment; filename="${fileName + filetype}"`,
      },
      { key: "Content-Type", value: "application/javascript" },
    ];

    return { script, headers };
  },
};

export default scriptService;
