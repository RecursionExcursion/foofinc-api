import express from "express";

import scriptController from "./script/controller/scriptController";
import authController from "./auth/controller/authController";
import { tokenAuthHandler } from "../lib/auth";

const router = express.Router();

router.use("/auth", authController);
router.use("/script", tokenAuthHandler, scriptController);

export default router;
