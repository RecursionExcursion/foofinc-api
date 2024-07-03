import express from "express";
import scriptService from "./scriptService";
import { ScriptType } from "./types/scriptType";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

router.get("/dl", (req, res) => {
  const scriptType = req.query.type as ScriptType;

  if (!scriptType) return res.status(400).send("Invalid script type");

  const { headers, script } = scriptService.generateScript(scriptType);

  headers.forEach(({ key, value }) => res.setHeader(key, value));

  res.write(script);
  res.end();
});

export default router;
