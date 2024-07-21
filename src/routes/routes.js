import express from "express";

import scriptController from "./script/controller/scriptController.js";
import authController from "./auth/controller/authController.js";
import { tokenAuthHandler } from "../lib/auth.js";

const router = express.Router();

router.use("/auth", authController);
router.use("/script", tokenAuthHandler, scriptController);

export default router;
