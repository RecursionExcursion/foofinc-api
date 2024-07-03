import express from "express";
import scriptService from "./scriptService";
import info from "./constants/info";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send(JSON.stringify("Hello World!"));
});

router.get("/info", (req, res) => {
  res.status(200).send(info);
});

router.post("/", (req, res) => {
  const { type } = req.body;

  if (!type) return res.status(400).send("Invalid script type");

  const { script, fileName } = scriptService.generateScript(type);

  return res.send({
    script,
    fileName,
  });
});

export default router;
