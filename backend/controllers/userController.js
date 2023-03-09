const User = require("../models/User");
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

  return !users?.length
    ? next(new ErrorHandler("No users found"))
    : SuccessHandler(
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

  const user = await User.findById(id).select("-password").lean().exec();

  return !user
    ? next(new ErrorHandler("No user found"))
    : SuccessHandler(res, `User ${user.name} with ID ${id} retrieved`, user);
});

exports.createNewUser = asyncHandler(async (req, res, next) => {
  const requiredFields = ["name", "email", "password", "roles"];
  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length)
    return next(
      new ErrorHandler(
        JSON.stringify(
          missingFields.map((field) => ({ [field]: `${field} is required` }))
        ).replace(/[{}\[\]\\"]/g, "")
      )
    );

  const { name, email, password, roles } = req.body;

  if (!Array.isArray(roles) || !roles.length)
    next(new ErrorHandler("At least one role is required"));

  const duplicate = await User.findOne({ name })
    .collation({ locale: "en" })
    .lean()
    .exec();

  return duplicate
    ? next(new ErrorHandler("Duplicate name"))
    : await User.create({
        name,
        email,
        password: await bcrypt.hash(password, Number(process.env.SALT_NUMBER)),
        roles,
      }).then((user) =>
        SuccessHandler(
          res,
          `New user ${name} created with an ID ${user._id}`,
          user
        )
      );
});

exports.updateUser = asyncHandler(async (req, res, next) => {
  const requiredFields = ["name", "email", "roles"];
  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length)
    return next(
      new ErrorHandler(
        JSON.stringify(
          missingFields.map((field) => ({ [field]: `${field} is required` }))
        ).replace(/[{}\[\]\\"]/g, "")
      )
    );

  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return next(new ErrorHandler(`User not found with ID: ${req.params.id}`));

  const user = await User.findById(req.params.id).exec();

  if (!user) return next(new ErrorHandler("No user found"));

  if (!Array.isArray(user.roles) || !user.roles.length)
    next(new ErrorHandler("At least one role is required"));

  const duplicate = await User.findOne({
    name: req.body.name,
    _id: { $ne: user._id },
  })
    .collation({ locale: "en" })
    .lean()
    .exec();

  return duplicate
    ? next(new ErrorHandler("Duplicate name"))
    : User.findByIdAndUpdate(user._id, req.body, {
        new: true,
        runValidators: true,
      })
        .lean()
        .exec()
        .then((updatedUser) =>
          !updatedUser
            ? next(new ErrorHandler("No user found"))
            : SuccessHandler(
                res,
                `User ${updatedUser.name} with ID ${updatedUser._id} is updated`,
                updatedUser
              )
        );
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id))
    return next(new ErrorHandler(`User not found with ID: ${id}`));

  if (!id) return next(new ErrorHandler("User ID required"));

  const user = await User.findOneAndDelete({ _id: id }).lean().exec();

  return !user
    ? next(new ErrorHandler("No user found"))
    : SuccessHandler(res, `User ${user.name} with ID ${id} is deleted`, user);
});
