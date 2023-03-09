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

  if (!users?.length) next(new ErrorHandler("No users found"));

  SuccessHandler(res, "Success", users);
});

exports.getSingleUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return next(new ErrorHandler("Invalid ID"));

  const user = await User.findById(id)
    .sort({ createdAt: -1 })
    .select("-password")
    .lean()
    .exec();

  if (!user?.length) next(new ErrorHandler("No users found"));

  SuccessHandler(res, `user with an id ${id} is found`, user);
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

  SuccessHandler(res, `New user ${name} created`, user);
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
    return next(new ErrorHandler("Invalid ID"));

  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .lean()
    .exec();

  if (!user) return next(new ErrorHandler("No user found"));

  if (req.body.name) {
    const duplicate = await User.findOne({
      name: req.body.name,
      _id: { $ne: req.params.id },
    })
      .collation({ locale: "en", strength: 2 })
      .lean()
      .exec();

    if (duplicate) return next(new ErrorHandler("Duplicate name"));
  }

  SuccessHandler(res, `user with an id ${req.params.id} is updated`, user);
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "User ID Required" });
  }

  const note = await Note.findOne({ user: id }).lean().exec();
  if (note) {
    return res.status(400).json({ message: "User has assigned notes" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const result = await user.deleteOne();

  const reply = `Username ${result.username} with ID ${result._id} deleted`;

  res.json(reply);
});
