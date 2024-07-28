import express from "express";
import { body } from "express-validator";

import { isLogin } from "../middleware/is-login.js";
import { getUsers } from "../controllers/user.js";

const router = express.Router();

router.get("/", isLogin, getUsers);
export default router;
