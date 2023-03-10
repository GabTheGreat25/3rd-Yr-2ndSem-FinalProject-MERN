const Camera = require("../models/Camera");
const SuccessHandler = require("../utils/successHandler");
const ErrorHandler = require("../utils/errorHandler");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

exports.getAllCameras = asyncHandler(async (req, res, next) => {
  const cameras = await Camera.find()
    .populate("user", "name")
    .sort({ createdAt: -1 })
    .lean()
    .exec();

  return !cameras?.length
    ? next(new ErrorHandler("No cameras found"))
    : SuccessHandler(
        res,
        `Cameras with names ${cameras
          .map((u) => u.name)
          .join(", ")} and IDs ${cameras
          .map((u) => u._id)
          .join(", ")} retrieved`,
        cameras
      );
});

exports.getSingleCamera = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return next(new ErrorHandler(`Camera not found with ID: ${id}`));

  const camera = await Camera.findById(id)
    .populate("user", "name")
    .lean()
    .exec();

  return !camera
    ? next(new ErrorHandler("No camera found"))
    : SuccessHandler(
        res,
        `Camera ${camera.name} with ID ${id} retrieved`,
        camera
      );
});

exports.createNewCamera = asyncHandler(async (req, res, next) => {
  const requiredFields = ["user", "name", "text", "price"];
  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length)
    return next(
      new ErrorHandler(
        JSON.stringify(
          missingFields.map((field) => ({ [field]: `${field} is required` }))
        ).replace(/[{}\[\]\\"]/g, "")
      )
    );

  const { user, name, text, price } = req.body;

  const duplicate = await Camera.findOne({ name })
    .collation({ locale: "en" })
    .lean()
    .exec();

  return duplicate
    ? next(new ErrorHandler("Duplicate name"))
    : await Camera.create({
        user,
        name,
        text,
        price,
      }).then((camera) =>
        SuccessHandler(
          res,
          `New camera ${name} created with an ID ${camera._id}`,
          camera
        )
      );
});

exports.updateCamera = asyncHandler(async (req, res, next) => {
  const requiredFields = ["user", "name", "text", "price"];
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
    return next(new ErrorHandler(`Camera not found with ID: ${req.params.id}`));

  const camera = await Camera.findById(req.params.id).exec();

  if (!camera) return next(new ErrorHandler("No camera found"));

  const duplicate = await Camera.findOne({
    name: req.body.name,
    _id: { $ne: camera._id },
  })
    .collation({ locale: "en" })
    .lean()
    .exec();

  return duplicate
    ? next(new ErrorHandler("Duplicate name"))
    : Camera.findByIdAndUpdate(camera._id, req.body, {
        new: true,
        runValidators: true,
      })
        .lean()
        .exec()
        .then((updatedCamera) =>
          !updatedCamera
            ? next(new ErrorHandler("No camera found"))
            : SuccessHandler(
                res,
                `Camera ${updatedCamera.name} with ID ${updatedCamera._id} is updated`,
                updatedCamera
              )
        );
});

exports.deleteCamera = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id))
    return next(new ErrorHandler(`Camera not found with ID: ${id}`));

  if (!id) return next(new ErrorHandler("Camera ID required"));

  const camera = await Camera.findOneAndDelete({ _id: id }).lean().exec();

  return !camera
    ? next(new ErrorHandler("No camera found"))
    : SuccessHandler(
        res,
        `Camera ${camera.name} with ID ${id} is deleted`,
        camera
      );
});
