import express from "express";
import scriptService from "./scriptService";
import info from "./constants/info";
import { ScriptRequest } from "./types/scriptRequest";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send(JSON.stringify("Hello World!"));
});

router.get("/info", (req, res) => {
  res.status(200).send(info);
});

router.post("/", (req, res) => {
  const scriptRequest = req.body as ScriptRequest;

  const { success, fileData, additionalData } =
    scriptService.generateScript(scriptRequest);

  if (!success) {
    return res
      .status(400)
      .send(`Expected body format - ${JSON.stringify(additionalData)}`);
  }

  return res.send(JSON.stringify(fileData));
});

export default router;
