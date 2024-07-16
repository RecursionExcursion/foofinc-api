import express from "express";
import scriptService from "../service/scriptService";
import { ScriptRequest } from "../types/scriptRequest";
import supportedServices from "../constants/serviceProvider";
import { pkgService } from "../service/pkgService";

const router = express.Router();

router.get("/", (req, res) => {
  res.json("Hello World!");
});

router.get("/services", (req, res) => {
  res.json(supportedServices);
});

router.post("/", (req, res) => {
  const scriptRequest = req.body as ScriptRequest;

  const { success, fileData, additionalData } =
    scriptService.createScript(scriptRequest);

  if (!success) {
    return res.status(400).json({
      message: additionalData,
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

router.get("/pkg", async (req, res) => {
  const stream = await pkgService();
  // res.setHeader('Content-Disposition', 'attachment; filename="package.exe"');
  // res.setHeader('Content-Type', 'application/octet-stream');
  stream.pipe(res);
  // return res.send(stream);
});

export default router;
