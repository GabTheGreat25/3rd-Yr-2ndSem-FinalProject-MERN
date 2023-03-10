const express = require("express");
const router = express.Router();
const camerasController = require("../controllers/cameraController");

router
  .route("/cameras")
  .get(camerasController.getAllCameras)
  .post(camerasController.createNewCamera);

router
  .route("/camera/:id")
  .get(camerasController.getSingleCamera)
  .patch(camerasController.updateCamera)
  .delete(camerasController.deleteCamera);

module.exports = router;
