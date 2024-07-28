import express from "express";
import { body } from "express-validator";
import {
  signup as signupController,
  login as loginController,
  logout as logoutController,
} from "../controllers/auth.js";

const router = express.Router();

router.post(
  "/signup",
  [
    body("fullName").notEmpty().withMessage("Full name should not be empty"),
    body("userName")
      .notEmpty()
      .withMessage("userName should not be empty")
      .isLength({ min: 5 })
      .withMessage("Username should be at least 4 char")
      .not()
      .contains(" ")
      .withMessage("No spaces are allowed in the username"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password should be at least 6 char"),
    body("gender")
      .isIn(["male", "female"])
      .withMessage("Gender should be male or female"),
  ],
  signupController
);

router.post(
  "/login",
  [
    body("userName")
      .notEmpty()
      .withMessage("User name should not be empty")
      .isLength({ min: 5 })
      .withMessage("User name should be at least 4 char")
      .not()
      .contains(" ")
      .withMessage("No spaces are allowed in the username"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password should be at least 6 char"),
  ],
  loginController
);

router.post(
  "/logout",

  logoutController
);
export default router;
