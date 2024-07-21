import cors from "cors";

const corsOptions = {
  origin: ["http://localhost:3000"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["x-api-key,Content-Type,Authorization"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
};

export default cors(corsOptions);
