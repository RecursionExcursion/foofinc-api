import express from "express";
import scriptService from "./scriptService";
import info from "./constants/info";
import { ScriptRequest } from "./types/scriptRequest";

const router = express.Router();

router.get("/", (req, res) => {
  res.json("Hello World!");
});

router.get("/info", (req, res) => {
  res.json(info);
});

router.post("/", (req, res) => {
  const scriptRequest = req.body as ScriptRequest;

  const { success, fileData, additionalData } =
    scriptService.createScript(scriptRequest);

  if (!success) {
    return res.status(400).json({
      message: `Expected body format - ${JSON.stringify(additionalData)}`,
    });
  }

  return res.json(fileData);
});

router.post("/cli", (req, res) => {
  const scriptRequest = req.body as ScriptRequest;

  const { success, cliCommands, additionalData } =
    scriptService.createCliCommands(scriptRequest);

  if (!success) {
    return res.status(400).json({
      message: `Expected body format - ${JSON.stringify(additionalData)}`,
    });
  }

  return res.json(cliCommands);
});

export default router;
