const User = require("../models/user");
const SuccessHandler = require("../utils/successHandler");
const ErrorHandler = require("../utils/errorHandler");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find()
    .sort({ createdAt: -1 })
    .select("-password")
    .lean()
    .exec();

  if (!users?.length) {
    return next(new ErrorHandler("No users found"));
  }

  SuccessHandler(
    res,
    `Users with names ${users.map((u) => u.name).join(", ")} and IDs ${users
      .map((u) => u._id)
      .join(", ")} retrieved`,
    users
  );
});

exports.getSingleUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return next(new ErrorHandler(`User not found with ID: ${id}`));

  const user = await User.findById(id)
    .sort({ createdAt: -1 })
    .select("-password")
    .lean()
    .exec();

  if (!user?.length) next(new ErrorHandler("No users found"));

  SuccessHandler(res, `User ${user.name} with ID ${id} retrieved`, user);
});

exports.createNewUser = asyncHandler(async (req, res, next) => {
  const requiredFields = ["name", "email", "password", "roles"];
  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length) {
    const errors = missingFields.map((field) => ({
      [field]: ` ${field} is required`,
    }));
    const errorsJsonString = JSON.stringify(errors).replace(/[{}\[\]\\"]/g, "");
    return next(new ErrorHandler(errorsJsonString));
  }

  const { name, email, password, roles } = req.body;

  if (!Array.isArray(roles) || !roles.length)
    next(new ErrorHandler("At least one role is required"));

  const duplicate = await User.findOne({ name })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate) next(new ErrorHandler("Duplicate name"));

  const user = await User.create({
    name,
    email,
    password: await bcrypt.hash(password, Number(process.env.SALT_NUMBER)),
    roles,
  });

  SuccessHandler(res, `New user ${name} created with an ID ${user._id}`, user);
});

exports.updateUser = asyncHandler(async (req, res, next) => {
  const requiredFields = ["name", "email", "roles"];
  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length) {
    const errors = missingFields.map((field) => ({
      [field]: ` ${field} is required`,
    }));
    const errorsJsonString = JSON.stringify(errors).replace(/[{}\[\]\\"]/g, "");
    return next(new ErrorHandler(errorsJsonString));
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return next(new ErrorHandler(`User not found with ID: ${req.params.id}`));

  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .lean()
    .exec();

  if (!user) return next(new ErrorHandler("No user found"));

  if (user.name) {
    const duplicate = await User.findOne({
      name: user.name,
      _id: { $ne: user._id },
    })
      .collation({ locale: "en", strength: 2 })
      .lean()
      .exec();

    if (duplicate) return next(new ErrorHandler("Duplicate name"));
  }

  SuccessHandler(res, `User ${user.name} with ID ${user._id} is updated`, user);
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id))
    return next(new ErrorHandler(`User not found with ID: ${id}`));

  if (!id) return next(new ErrorHandler(`User ID Required`));

  const user = await User.findOneAndDelete({ _id: id }).lean().exec();

  if (!user) return next(new ErrorHandler("No user found"));

  SuccessHandler(res, `User ${user.name} with ID ${id} is deleted`, user);
});
