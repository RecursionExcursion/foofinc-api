import express from "express";
import scriptService from "./scriptService";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send(JSON.stringify("Hello World!"));
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
