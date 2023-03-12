const SuccessHandler = require("../utils/successHandler");
const ErrorHandler = require("../utils/errorHandler");
const camerasAction = require("../actions/cameraAction");
const asyncHandler = require("express-async-handler");
const checkRequiredFields = require("../helpers/checkRequiredFields");

exports.getAllCameras = asyncHandler(async (req, res, next) => {
  const cameras = await camerasAction.getAllCamerasData();

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
  const camera = await camerasAction.getSingleCameraData(req.params.id);

  return !camera
    ? next(new ErrorHandler("No camera found"))
    : SuccessHandler(
        res,
        `Camera ${camera.name} with ID ${camera._id} retrieved`,
        camera
      );
});

exports.createNewCamera = [
  checkRequiredFields(["user", "name", "text", "price"]),
  asyncHandler(async (req, res, next) => {
    const camera = await camerasAction.CreateCameraData(req);

    return SuccessHandler(
      res,
      `New camera ${camera.name} created with an ID ${camera._id}`,
      camera
    );
  }),
];

exports.updateCamera = [
  checkRequiredFields(["user", "name", "text", "price"]),
  asyncHandler(async (req, res, next) => {
    const camera = await camerasAction.updateCameraData(
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
  const camera = await camerasAction.deleteCameraData(req.params.id);

  return !camera
    ? next(new ErrorHandler("No camera found"))
    : SuccessHandler(
        res,
        `Camera ${camera.name} with ID ${camera._id} is deleted`,
        camera
      );
});
