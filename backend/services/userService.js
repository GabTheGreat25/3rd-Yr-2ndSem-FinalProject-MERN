const User = require("../models/user");
const mongoose = require("mongoose");
const ErrorHandler = require("../utils/errorHandler");
const bcrypt = require("bcrypt");

exports.getAllUsersData = async () => {
  const users = await User.find()
    .sort({ createdAt: -1 })
    .select("-password")
    .lean()
    .exec();

  return users;
};

exports.getSingleUserData = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid user ID: ${id}`);

  const user = await User.findById(id).select("-password").lean().exec();

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
