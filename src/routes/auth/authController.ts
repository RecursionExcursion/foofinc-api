import express from "express";
import { generateAccessToken } from "../../lib/auth";

const router = express.Router();

router.get("/", (req, res) => {
  const key = req.headers["x-api-key"];

  console.log({ key});
  
  if (key !== process.env.API_KEY) {
    return res.status(401).send("Unauthorized");
  }

  const accessToken = generateAccessToken({ key });

  if (!accessToken) {
    return res.status(500).send("Internal Server Error");
  }

  return res.json({ accessToken });
});

export default router;
