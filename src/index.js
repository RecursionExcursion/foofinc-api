import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "./lib/cors.js";
import routes from "./routes/routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors);
app.use(express.json());

app.use((req, res, next) => {
  next();
});

app.get("/", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  const getPagePathFromRoot = (page) => path.join(process.cwd(), "pages", page);

  if (token) {
    res.sendFile(getPagePathFromRoot({ page: "/home-auth.html" }));
  } else {
    res.sendFile(getPagePathFromRoot({ page: "/home-no-auth.html" }));
  }
});

app.use(routes);

app.listen(PORT);

export default app;
