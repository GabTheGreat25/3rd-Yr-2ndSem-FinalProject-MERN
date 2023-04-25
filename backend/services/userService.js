const User = require("../models/user");
const mongoose = require("mongoose");
const Camera = require("../models/camera");
const Note = require("../models/note");
const Transaction = require("../models/transaction");
const ErrorHandler = require("../utils/errorHandler");
const bcrypt = require("bcrypt");
const token = require("../utils/token");
const { cloudinary } = require("../utils/cloudinary");
const uuid = require("uuid");
const { sendEmail } = require("../utils/sendEmail");

exports.updatePassword = async (
  id,
  oldPassword,
  newPassword,
  confirmPassword
) => {
  const user = await User.findById(id).select("+password");

  if (!user) throw new ErrorHandler("User not found");

  const isMatch = await bcrypt.compare(oldPassword, user.password);

  if (!isMatch) throw new ErrorHandler("Invalid old password");

  if (newPassword !== confirmPassword)
    throw new ErrorHandler("Passwords do not match");

  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(process.env.SALT_NUMBER)
  );

  user.password = hashedPassword;

  await user.save();

  return user;
};

exports.sendResetPassword = async (
  resetToken,
  newPassword,
  confirmPassword
) => {
  const loginUrl = `http://localhost:6969/login`;

  const user = await User.findOne({ resetToken });

  if (newPassword !== confirmPassword)
    throw new ErrorHandler("Passwords don't match");

  if (user.resetTokenUsed)
    throw new ErrorHandler("Reset token has already been used");

  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(process.env.SALT_NUMBER)
  );
  user.password = hashedPassword;
  user.resetTokenUsed = true;
  await user.save();

  const emailOptions = {
    to: user.email,
    subject: "Password Reset Successful",
    html: `<html>
  <head>
    <style>
      /* Add styles to make the email look more visually appealing */
      body {
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
        color: #444;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #fff;
        border: 1px solid #ddd;
        border-radius: 5px;
      }
      h1 {
        font-size: 24px;
        margin-bottom: 20px;
        text-align: center;
      }
      p {
        font-size: 16px;
        margin-bottom: 20px;
      }
      .center {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      a {
        color: #fff;
        background-color: #4caf50;
        padding: 10px 20px;
        border-radius: 5px;
        text-decoration: none;
        display: inline-block;
      }

      .bottom{
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Password Reset Successful</h1>
      <p>Your password has been successfully reset. If you did not perform this action, please contact support immediately.</p>
      <p class="center">
        <a href="${loginUrl}">Go Back To The Login Page</a>
      </p>
    </div>
  </body>
</html>

`,
  };

  await sendEmail(emailOptions);

  return `Password updated successfully for user with email ${user.email}`;
};

exports.sendPasswordResetEmail = async (req, email) => {
  if (!email) throw new ErrorHandler("Please provide an email");

  const resetToken = uuid.v4();
  const resetUrl = `http://localhost:6969/password/reset/${resetToken}`;

  const user = await User.findOne({ email });

  if (!user) throw new ErrorHandler("User not found");

  user.resetTokenUsed = false;
  await user.save();

  const emailOptions = {
    to: email,
    subject: "Password Reset Request",
    html: `<html>
  <head>
    <style>
      /* Add styles to make the email look more visually appealing */
      body {
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
        color: #444;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #fff;
        border: 1px solid #ddd;
        border-radius: 5px;
      }
      h1 {
        font-size: 24px;
        margin-bottom: 20px;
        text-align: center;
      }
      p {
        font-size: 16px;
        margin-bottom: 20px;
      }
      .center {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      a {
        color: #fff;
        background-color: #4caf50;
        padding: 10px 20px;
        border-radius: 5px;
        text-decoration: none;
        display: inline-block;
      }

      .bottom{
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Password Reset Request</h1>
      <p>You have requested to reset your password. Please click the following link to reset your password:</p>
      <p class="center">
        <a href="${resetUrl}">Reset Password</a>
      </p>
      <p class="bottom">If you did not request to reset your password, please ignore this email.</p>
    </div>
  </body>
</html>

`,
  };

  await sendEmail(emailOptions);

  return `Reset password email sent successfully to ${email}`;
};

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

  const accessTokenMaxAge = 7 * 24 * 60 * 60 * 1000;

  return { user: foundUser, accessToken, accessTokenMaxAge };
};

const blacklistedTokens = [];

exports.logoutUser = (cookies, res) => {
  return new Promise((resolve, reject) => {
    !cookies?.jwt
      ? reject(new Error("You are not logged in"))
      : (blacklistedTokens.push(cookies.jwt), // add token to blacklist array
        res.clearCookie("jwt", {
          httpOnly: true,
          sameSite: "None",
          secure: true,
        }),
        resolve());
  });
};

exports.getBlacklistedTokens = () => {
  return blacklistedTokens;
};

exports.getAllUsersData = (page, limit, search, sort, filter) => {
  const skip = (page - 1) * limit;

  let usersQuery = User.find();

  // Apply search option
  if (search) {
    usersQuery = usersQuery.where("name").regex(new RegExp(search, "i"));
  }

  // Apply sort option
  if (sort) {
    const [field, order] = sort.split(":");
    usersQuery = usersQuery.sort({ [field]: order === "asc" ? 1 : -1 });
  } else {
    usersQuery = usersQuery.sort({ createdAt: -1 });
  }

  // Apply filter option
  if (filter) {
    const [field, value] = filter.split(":");
    usersQuery = usersQuery.where(field).equals(value);
  }

  usersQuery = usersQuery.skip(skip).limit(limit);

  return usersQuery;
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

  let images = [];
  if (req.files && Array.isArray(req.files)) {
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
  }

  if (images.length === 0)
    throw new ErrorHandler("At least one image is required");

  const roles = req.body.roles
    ? Array.isArray(req.body.roles)
      ? req.body.roles
      : req.body.roles.split(", ")
    : ["Customer"];

  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: await bcrypt.hash(
      req.body.password,
      Number(process.env.SALT_NUMBER)
    ),
    roles: roles,
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

  let images = [];
  if (req.files && Array.isArray(req.files)) {
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

  const roles = req.body.roles
    ? Array.isArray(req.body.roles)
      ? req.body.roles
      : req.body.roles.split(", ")
    : ["Customer"];

  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      ...req.body,
      roles: roles,
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
    Note.deleteMany({ user: id }).lean().exec(),
    Camera.deleteMany({ user: id }).lean().exec(),
    Transaction.deleteMany({ user: id }).lean().exec(),
  ]);

  return user;
};
