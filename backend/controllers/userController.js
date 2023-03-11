const SuccessHandler = require("../utils/successHandler");
const ErrorHandler = require("../utils/errorHandler");
const usersAction = require("../actions/userAction");
const asyncHandler = require("express-async-handler");
const checkRequiredFields = require("../helpers/checkRequiredFields");

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await usersAction.getAllUsersData();

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
  const user = await usersAction.getSingleUserData(req.params.id);

  return !user
    ? next(new ErrorHandler("No user found"))
    : SuccessHandler(
        res,
        `User ${user.name} with ID ${req.params.id} retrieved`,
        user
      );
});

exports.createNewUser = [
  checkRequiredFields(["name", "email", "password"]),
  asyncHandler(async (req, res, next) => {
    const user = await usersAction.CreateUserData(req);

    return !user
      ? next(new ErrorHandler("Error creating new user"))
      : SuccessHandler(
          res,
          `New user ${user.name} created with an ID ${user._id}`,
          user
        );
  }),
];

exports.updateUser = [
  checkRequiredFields(["name", "email", "roles"]),
  asyncHandler(async (req, res, next) => {
    const user = await usersAction.updateUserData(req, res, req.params.id);

    return !user
      ? next(new ErrorHandler("Error updating user"))
      : SuccessHandler(
          res,
          `User ${user.name} with ID ${user._id} is updated`,
          user
        );
  }),
];

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await usersAction.deleteUserData(req.params.id);

  return !user
    ? next(new ErrorHandler("No user found"))
    : SuccessHandler(
        res,
        `User ${user.name} with ID ${user._id} is deleted`,
        user
      );
});
