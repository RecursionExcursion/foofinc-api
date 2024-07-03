import express, { Application, Request, Response, NextFunction } from "express";
import scriptController from "./routes/script-gen/scriptController";
import authController from "./routes/auth/authController";
import dotenv from "dotenv";

import { tokenAuthHandler } from "./lib/auth";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT;
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("oi");

  next();
});

app.use("/auth", authController);
app.use("/script", tokenAuthHandler, scriptController);

app.listen(PORT);

export default app;
