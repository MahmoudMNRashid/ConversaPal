import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
//
import User from "../models/user.js";
import { createError } from "../util/errors.js";
import {
  generateRandomColor,
  generateTokenAndSetCookie,
} from "../util/help.js";

export const signup = async (req, res, next) => {
  const { fullName, userName, password, confirmPassword, gender } = req.body;
  const errors = validationResult(req);
  try {
    //check validation
    !errors.isEmpty()
      ? createError(422, "Validation Failed", errors.array())
      : null;

    password !== confirmPassword
      ? createError(422, `Passwords don't match`)
      : null;

    //check if userName found in db
    const user = await User.findOne({ userName: userName });

    user ? createError(400, "Username already exists") : null;

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 12);

    const logo = `https://avatar.iran.liara.run/username?username=${fullName}&background=${generateRandomColor()}`;

    const newUser = new User({
      fullName,
      userName,
      password: hashedPassword,
      gender,
      logo,
    });

    await newUser.save();

    generateTokenAndSetCookie(newUser._id, res);
    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      username: newUser.userName,
      logo: newUser.logo,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { userName, password } = req.body;
  const errors = validationResult(req);

  try {
    //check validation
    !errors.isEmpty()
      ? createError(422, "Validation Failed", errors.array())
      : null;
    const user = await User.findOne({ userName: userName });
    //check password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || "" // if there are user put the password or put ''
    );
    //check if user found or password is correct
    !user || !isPasswordCorrect
      ? createError(400, "Invalid username or password")
      : null;

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.userName,
      logo: user.logo,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};
