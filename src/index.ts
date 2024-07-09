import express, { Application, Request, Response, NextFunction } from "express";
import scriptController from "./routes/script-gen/scriptController";
import authController from "./routes/auth/authController";
import dotenv from "dotenv";

import { tokenAuthHandler } from "./lib/auth";
import cors from "./lib/cors";
import { servePage } from "./lib/pageServer";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT;

app.use(cors);
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  next();
});

app.get("/", (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  token
    ? servePage({ page: "/home-auth.html", res })
    : servePage({ page: "/home-no-auth.html", res });
});

app.use("/auth", authController);
app.use("/script", tokenAuthHandler, scriptController);

app.listen(PORT);

export default app;
