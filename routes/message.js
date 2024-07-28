import express from "express";
import { body, param } from "express-validator";
import {
  getMessage as getMessageController,
  sendMessage as sendMessageController,
} from "../controllers/message.js";
import { isLogin } from "../middleware/is-login.js";

const router = express.Router();

router.post(
  "/send/:id",
  param("id").isMongoId().withMessage("Invalid ID"),
  isLogin,
  sendMessageController
);
router.get("/:id", isLogin, getMessageController);

export default router;
