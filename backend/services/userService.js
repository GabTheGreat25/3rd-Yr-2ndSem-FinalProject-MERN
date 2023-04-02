const User = require("../models/user");
const mongoose = require("mongoose");
const ErrorHandler = require("../utils/errorHandler");
const bcrypt = require("bcrypt");
const token = require("../utils/token");
const { cloudinary } = require("../utils/cloudinary");

exports.loginToken = async (email, password) => {
  const foundUser = await User.findOne({ email }).select("+password").exec();

  if (!foundUser || !foundUser.active)
    throw new ErrorHandler("Wrong Email Or Password");

  const match = await bcrypt.compare(password, foundUser.password);

  if (!match) throw new ErrorHandler("Wrong Password");

  const accessToken = token.generateAccessToken(
    foundUser.email,
    foundUser.roles
  );

  const refreshToken = token.generateRefreshToken(foundUser.email);

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

exports.logoutUser = (cookies, res) => {
  return new Promise((resolve, reject) => {
    !cookies?.jwt
      ? reject(new Error("You are not logged in"))
      : (res.clearCookie("jwt", {
          httpOnly: true,
          sameSite: "None",
          secure: true,
        }),
        resolve());
  });
};

exports.isUserLoggedIn = (cookies) => {
  return !!cookies.jwt;
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
  const duplicateUser = await User.findOne({ name: req.body.name })
    .collation({ locale: "en" })
    .lean()
    .exec();

  if (duplicateUser) throw new ErrorHandler("Duplicate name");

  const images = await Promise.all(
    req.files.map(async (file) => {
      const result = await cloudinary.uploader.upload(file.path, {
        public_id: file.filename,
      });
      return {
        public_id: result.public_id,
        url: result.url,
        originalname: file.originalname,
      };
    })
  );

  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: await bcrypt.hash(
      req.body.password,
      Number(process.env.SALT_NUMBER)
    ),
    roles: req.body.roles.split(",") || ["Customer"],
    image: images,
  });

  return user;
};

exports.updateUserData = async (req, res, id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid user ID: ${id}`);

  const existingUser = await User.findById(id).lean().exec();

  if (!existingUser) throw new ErrorHandler(`User not found with ID: ${id}`);

  const duplicateUser = await User.findOne({
    name: req.body.name,
    _id: { $ne: id },
  })
    .collation({ locale: "en" })
    .lean()
    .exec();

  if (duplicateUser) throw new ErrorHandler("Duplicate name");

  let images;
  if (req.files && req.files.length > 0) {
    images = await Promise.all(
      req.files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          public_id: file.filename,
        });
        return {
          public_id: result.public_id,
          url: result.url,
          originalname: file.originalname,
        };
      })
    );
    await cloudinary.api.delete_resources(
      existingUser.image.map((image) => image.public_id)
    );
  } else images = existingUser.image || [];

  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      ...req.body,
      roles: req.body.roles.split(","),
      image: images,
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .lean()
    .exec();

  if (!updatedUser) throw new ErrorHandler(`User not found with ID: ${id}`);

  return updatedUser;
};

exports.deleteUserData = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid user ID: ${id}`);

  const user = await User.findOne({ _id: id });
  if (!user) throw new ErrorHandler(`User not found with ID: ${id}`);

  const publicIds = user.image.map((image) => image.public_id);

  await Promise.all([
    User.deleteOne({ _id: id }).lean().exec(),
    cloudinary.api.delete_resources(publicIds),
  ]);

  return user;
};
