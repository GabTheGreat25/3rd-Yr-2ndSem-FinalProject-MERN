<<<<<<< Updated upstream
const SuccessHandler = require("../utils/successHandler");
const ErrorHandler = require("../utils/errorHandler");
const usersService = require("../services/userService");
const asyncHandler = require("express-async-handler");
const checkRequiredFields = require("../helpers/checkRequiredFields");
const token = require("../utils/token");
const { upload } = require("../utils/cloudinary");
=======
const SuccessHandler = require('../utils/successHandler')
const ErrorHandler = require('../utils/errorHandler')
const usersService = require('../services/userService')
const asyncHandler = require('express-async-handler')
const sendToken = require('../utils/jwtToken')

const checkRequiredFields = require('../helpers/checkRequiredFields')
const crypto = require('crypto')
const User = require('../models/user')
const sendEmail = require('../utils/sendEmail')
const token = require('../utils/token')
const { upload } = require('../utils/cloudinary')
>>>>>>> Stashed changes

exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return next(new ErrorHandler('User not found with this email', 404))
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken()
  await user.save({ validateBeforeSave: false })

  // Create reset password url
  const resetUrl = `${req.protocol}://${req.get(
    'host',
  )}/password/reset/${resetToken}`
  const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`

  try {
    await sendEmail({
      email: user.email,
      subject: 'Camera Rentals Password Recovery',
      message,
    })

    res.status(200).json({
      success: true,
      message: `Email sent to: ${user.email}`,
    })
  } catch (error) {
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save({ validateBeforeSave: false })

    return next(new ErrorHandler(error.message, 500))
  }
}

exports.resetPassword = async (req, res, next) => {
  // Hash URL token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex')
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  })
  if (!user) {
    return next(
      new ErrorHandler(
        'Password reset token is invalid or has been expired',
        400,
      ),
    )
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler('Password does not match', 400))
  }

  // Setup new password
  user.password = req.body.password
  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined
  await user.save()
  sendToken(user, 200, res)
}

exports.updatePassword = async (req, res, next) => {
  const user = await User.findById(req.user.id).select('password')
  // Check previous user password
  const isMatched = await user.comparePassword(req.body.oldPassword)
  if (!isMatched) {
    return next(new ErrorHandler('Old password is incorrect'))
  }
  user.password = req.body.password
  await user.save()
  sendToken(user, 200, res)
}

exports.login = [
  checkRequiredFields(["email", "password"]),
  asyncHandler(async (req, res, next) => {
    const { accessToken, refreshToken, refreshTokenMaxAge } =
      await usersService.loginToken(req.body.email, req.body.password);

    const setCookie = token.setRefreshTokenCookie(refreshTokenMaxAge);
    setCookie(res, refreshToken);

    SuccessHandler(res, "Token Generated", { accessToken });
  }),
];

exports.refresh = asyncHandler(async (req, res, next) => {
  const accessToken = await usersService.refreshToken(req.cookies.jwt);

  SuccessHandler(res, "Token Refreshed", { accessToken });
});

exports.logout = asyncHandler(async (req, res, next) => {
  const cookies = await usersService.logoutUser(req.cookies, res);

  SuccessHandler(res, "Cookie Cleared", cookies);
});

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search;
  const sort = req.query.sort;
  const filter = req.query.filter;

  const usersQuery = usersService.getAllUsersData(
    page,
    limit,
    search,
    sort,
    filter
  );
  const users = await usersQuery.lean();

  if (!users.length) {
    return next(new ErrorHandler("No users found"));
  }

  const userNames = users.map((u) => u.name).join(", ");
  const userIds = users.map((u) => u._id).join(", ");

  return SuccessHandler(
    res,
    `Users with names ${userNames} and IDs ${userIds} retrieved`,
    users
  );
});

exports.getSingleUser = asyncHandler(async (req, res, next) => {
  const user = await usersService.getSingleUserData(req.params.id);

  return !user
    ? next(new ErrorHandler("No user found"))
    : SuccessHandler(
        res,
        `User ${user.name} with ID ${user._id} retrieved`,
        user
      );
});

exports.createNewUser = [
  upload.array("image"),
  checkRequiredFields(["name", "email", "password", "image"]),
  asyncHandler(async (req, res, next) => {
    const user = await usersService.CreateUserData(req);

    return SuccessHandler(
      res,
      `New user ${user.name} created with an ID ${user._id}`,
      user
    );
  }),
];

exports.updateUser = [
  upload.array("image"),
  checkRequiredFields(["name", "email", "roles"]),
  asyncHandler(async (req, res, next) => {
    const user = await usersService.updateUserData(req, res, req.params.id);

    return SuccessHandler(
      res,
      `User ${user.name} with ID ${user._id} is updated`,
      user
    );
  }),
];

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await usersService.deleteUserData(req.params.id);

  return !user
    ? next(new ErrorHandler("No user found"))
    : SuccessHandler(
        res,
        `User ${user.name} with ID ${user._id} is deleted`,
        user
      );
});
