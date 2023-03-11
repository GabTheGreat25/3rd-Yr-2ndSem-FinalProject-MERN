const User = require("../models/user");
const mongoose = require("mongoose");
const ErrorHandler = require("../utils/errorHandler");
const bcrypt = require("bcrypt");

exports.getAllUsers = async () => {
  const users = await User.find()
    .sort({ createdAt: -1 })
    .select("-password")
    .lean()
    .exec();

  return users;
};

exports.getUserById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid user id: ${id}`);

  const user = await User.findById(id).select("-password").lean().exec();
  if (!user) throw new ErrorHandler(`User not found with ID: ${id}`);

  return user;
};

exports.CreateUserData = async (req, res) => {
  const { name, email, password, roles } = req.body;

  const duplicate = await User.findOne({ name })
    .collation({ locale: "en" })
    .lean()
    .exec();

  if (duplicate) throw new ErrorHandler("Duplicate name");

  const user = await User.create({
    name,
    email,
    password: await bcrypt.hash(password, Number(process.env.SALT_NUMBER)),
    roles: roles || ["Customer"],
  });

  return user;
};

exports.updateUserData = async (req, res, id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`User not found with ID: ${id}`);

  const user = await User.findById(id).exec();

  if (!user) throw new ErrorHandler("No user found");

  if (!Array.isArray(user.roles) || !user.roles.length)
    throw new ErrorHandler("At least one role is required");

  const duplicate = await User.findOne({
    name: req.body.name,
    _id: { $ne: user._id },
  })
    .collation({ locale: "en" })
    .lean()
    .exec();

  if (duplicate) throw new ErrorHandler("Duplicate name");

  const updatedUser = await User.findByIdAndUpdate(user._id, req.body, {
    new: true,
    runValidators: true,
  })
    .lean()
    .exec();

  return updatedUser;
};

exports.deleteUserData = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    return next(new ErrorHandler(`User not found with ID: ${id}`));

  if (!id) return next(new ErrorHandler("User ID required"));

  const user = await User.findOneAndDelete({ _id: id }).lean().exec();

  return user;
};
