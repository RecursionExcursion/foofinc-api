import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

// Boot express
const app: Application = express();
const PORT = process.env.PORT;
app.use(express.json());

// Application routing
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send({ data: "Hello World!" });
});

// Start server
app.listen(PORT, () => console.log("Server is listening on PORT:" + PORT));
