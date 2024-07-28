import { createError } from "../util/errors.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
export const isLogin = async (req, res, next) => {
  const token = req.cookies.jwt;
  try {
    !token ? createError(401, "Unauthorized - No Token") : null;

    let decodedtoken;
    decodedtoken = jwt.verify(token, process.env.PRIVATE_KEY);
    !decodedtoken ? createError(401, "Unauthorized - Invalid Token ") : null;

    const user = await User.findById(decodedtoken.userId, { _id: 1 });
    !user ? createError(404, "There is no user with this ID") : null;
    req.userId = user._id;
    next();
  } catch (error) {
    next(error);
  }
};
