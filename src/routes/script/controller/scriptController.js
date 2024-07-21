import express from "express";
import scriptService from "../service/scriptService.js";
import supportedServices from "../constants/serviceProvider.js";
import { pkgService } from "../service/pkgService.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json("Hello World!");
});

router.get("/services", (req, res) => {
  res.json(supportedServices);
});

router.post("/", (req, res) => {
  const scriptRequest = req.body;

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
  const scriptRequest = req.body;

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
  if (!stream) {
    return res.status(500).json({ message: "Error creating exe" });
  }

  // res.setHeader("Content-Encoding", "gzip");
  res.setHeader("Content-Encoding", "gzip");
  // res.setHeader("Transfer-Encoding", "chunked");

  try {
    stream.pipe(res);
  } catch (e) {
    console.log(e);
  }
});

export default router;
