const User = require("../models/user");
const mongoose = require("mongoose");
const ErrorHandler = require("../utils/errorHandler");
const bcrypt = require("bcrypt");
const token = require("../utils/token");

exports.loginToken = async (email, password) => {
  const foundUser = await User.findOne({ email }).select("+password").exec();

  if (!foundUser || !foundUser.active) throw new ErrorHandler("Unauthorize");

  const match = await bcrypt.compare(password, foundUser.password);

  if (!match) throw new ErrorHandler("Wrong Password");

  const accessToken = token.generateAccessToken(
    foundUser.email,
    foundUser.roles
  );

  const refreshToken = token.generateRefreshToken(foundUser.username);

  const refreshTokenMaxAge = 7 * 24 * 60 * 60 * 1000;

  return { accessToken, refreshToken, refreshTokenMaxAge };
};

exports.refreshToken = async (refreshToken) => {
  const decodedRefreshToken = token.verifyRefreshToken(refreshToken);

  const accessToken = token.generateAccessToken(
    decodedRefreshToken.email,
    decodedRefreshToken.roles
  );

  return accessToken;
};

exports.logoutUser = (cookies) => {
  return new Promise((resolve, reject) => {
    !cookies?.jwt
      ? reject(new Error("You are not logged in"))
      : (res.clearCookie("jwt", {
          httpOnly: true,
          sameSite: "None",
          secure: true,
        }),
        resolve(cookies));
  });
};

exports.getAllUsersData = async () => {
  const users = await User.find().sort({ createdAt: -1 }).lean().exec();

  return users;
};

exports.getSingleUserData = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid user ID: ${id}`);

  const user = await User.findById(id).lean().exec();

  if (!user) throw new ErrorHandler(`User not found with ID: ${id}`);

  return user;
};

exports.CreateUserData = async (req, res) => {
  const duplicate = await User.findOne({ name: req.body.name })
    .collation({ locale: "en" })
    .lean()
    .exec();

  if (duplicate) throw new ErrorHandler("Duplicate name");

  const user = await User.create({
    ...req.body,
    password: await bcrypt.hash(
      req.body.password,
      Number(process.env.SALT_NUMBER)
    ),
    roles: req.body.roles || ["Customer"],
  });

  return user;
};

exports.updateUserData = async (req, res, id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid user ID: ${id}`);

  const updatedUser = await User.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  })
    .lean()
    .exec();

  if (!updatedUser) throw new ErrorHandler(`User not found with ID: ${id}`);

  if (!Array.isArray(req.body.roles) || !req.body.roles.length)
    throw new ErrorHandler("At least one role is required");

  const duplicate = await User.findOne({
    name: req.body.name,
    _id: { $ne: id },
  })
    .collation({ locale: "en" })
    .lean()
    .exec();

  if (duplicate) throw new ErrorHandler("Duplicate name");

  return updatedUser;
};

exports.deleteUserData = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    return next(new ErrorHandler(`Invalid user ID: ${id}`));

  if (!id) return next(new ErrorHandler(`User not found with ID: ${id}`));

  const user = await User.findOneAndDelete({ _id: id }).lean().exec();

  return user;
};
