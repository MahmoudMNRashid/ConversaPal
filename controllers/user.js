import User from "../models/user.js";

export const getUsers = async (req, res, next) => {
  const loggedInUserId = req.userId;
  try {
    //without you
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    next(error);
  }
};
  