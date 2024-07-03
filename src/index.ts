import express, { Application, Request, Response, NextFunction } from "express";
import scriptController from "./routes/script-gen/scriptController";
import dotenv from "dotenv";

dotenv.config();

// Boot express
const app: Application = express();
const PORT = process.env.PORT;
app.use(express.json());

// App Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  next();
});

app.get("/", (req, res) => res.send("Express on Vercel"));

//Routes
app.use("/script", scriptController);

// Start server
app.listen(PORT, () => console.log(`Server is listening on PORT: ${PORT}!`));

export default app;