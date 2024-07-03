import { Header } from "../../types/RouteHandlerTypes";
import generateScript from "./lib/script-generation/scriptGenerator";
import { ScriptType } from "./types/scriptType";

const scriptService = {
  generateScript: (type: ScriptType) => {
    const script = generateScript(type);

    const fileName = `${type}-script.cjs`;
    const headers: Header[] = [
      {
        key: "Content-Disposition",
        value: `attachment; filename="${fileName}"`,
      },
      { key: "Content-Type", value: "application/javascript" },
    ];

    return { script, headers };
  },
};

export default scriptService;
