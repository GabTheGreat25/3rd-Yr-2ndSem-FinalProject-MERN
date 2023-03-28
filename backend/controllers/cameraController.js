const SuccessHandler = require("../utils/successHandler");
const ErrorHandler = require("../utils/errorHandler");
const camerasService = require("../services/cameraService");
const asyncHandler = require("express-async-handler");
const checkRequiredFields = require("../helpers/checkRequiredFields");
const { upload } = require("../utils/cloudinary");

exports.getAllCameras = asyncHandler(async (req, res, next) => {
  const cameras = await camerasService.getAllCamerasData();

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
  const camera = await camerasService.getSingleCameraData(req.params.id);

  return !camera
    ? next(new ErrorHandler("No camera found"))
    : SuccessHandler(
        res,
        `Camera ${camera.name} with ID ${camera._id} retrieved`,
        camera
      );
});

exports.createNewCamera = [
  upload.array("image"),
  checkRequiredFields(["user", "name", "text", "price"]),
  asyncHandler(async (req, res, next) => {
    const camera = await camerasService.CreateCameraData(req);

    return SuccessHandler(
      res,
      `New camera ${camera.name} created with an ID ${camera._id}`,
      camera
    );
  }),
];

exports.updateCamera = [
  upload.array("image"),
  checkRequiredFields(["user", "name", "text", "price"]),
  asyncHandler(async (req, res, next) => {
    const camera = await camerasService.updateCameraData(
      req,
      res,
      req.params.id
    );

    return SuccessHandler(
      res,
      `Camera ${camera.name} with ID ${camera._id} is updated`,
      camera
    );
  }),
];

exports.deleteCamera = asyncHandler(async (req, res, next) => {
  const camera = await camerasService.deleteCameraData(req.params.id);

  return !camera
    ? next(new ErrorHandler("No camera found"))
    : SuccessHandler(
        res,
        `Camera ${camera.name} with ID ${camera._id} is deleted`,
        camera
      );
});
