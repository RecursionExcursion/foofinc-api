import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "./lib/cors";
import { servePage } from "./lib/pageServer";
import routes from "./routes/routes";

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

  if (token) {
    servePage({ page: "/home-auth.html", res });
  } else {
    servePage({ page: "/home-no-auth.html", res });
  }
});

app.use(routes);

app.listen(PORT);

export default app;
