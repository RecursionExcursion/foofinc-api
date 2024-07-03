import express, { Application, Request, Response, NextFunction } from "express";
import scriptController from "./routes/script-gen/scriptController";
import authController from "./routes/auth/authController";
import dotenv from "dotenv";

import { tokenAuthHandler } from "./lib/auth";
import cors from "./lib/cors";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT;

app.use(cors);
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  next();
});

app.use("/auth", authController);
app.use("/script", tokenAuthHandler, scriptController);

app.listen(PORT);

export default app;
