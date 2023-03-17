const Camera = require("../models/Camera");
const ErrorHandler = require("../utils/errorHandler");
const mongoose = require("mongoose");

exports.getAllCamerasData = async () => {
  const cameras = await Camera.find()
    .populate({ path: "user", select: "name" })
    .sort({ createdAt: -1 })
    .lean()
    .exec();

  return cameras;
};

exports.getSingleCameraData = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid camera ID: ${id}`);

  const camera = await Camera.findById(id)
    .populate({ path: "user", select: "name" })
    .lean()
    .exec();

  if (!camera) throw new ErrorHandler(`Camera not found with ID: ${id}`);

  return camera;
};

exports.CreateCameraData = async (req, res) => {
  if (
    await Camera.findOne({ name: req.body.name })
      .collation({ locale: "en" })
      .lean()
      .exec()
  )
    throw new ErrorHandler("Duplicate name");

  const camera = await Camera.create(req.body);

  return camera;
};

exports.updateCameraData = async (req, res, id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid camera ID: ${id}`);

  const updatedCamera = await Camera.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  })
    .lean()
    .exec();

  if (!updatedCamera) throw new ErrorHandler(`Camera not found with ID: ${id}`);

  const duplicate = await Camera.findOne({
    name: req.body.name,
    _id: { $ne: id },
  })
    .collation({ locale: "en" })
    .lean()
    .exec();

  if (duplicate) throw new ErrorHandler("Duplicate name");

  return updatedCamera;
};

exports.deleteCameraData = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ErrorHandler(`Invalid camera ID: ${id}`);

  if (!id) throw new ErrorHandler(`Camera not found with ID: ${id}`);

  const camera = await Camera.findOneAndDelete({ _id: id }).lean().exec();

  return camera;
};
