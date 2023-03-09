const express = require("express");
const router = express.Router();
const usersController = require("../controllers/userController");

router
  .route("/users")
  .get(usersController.getAllUsers)
  .post(usersController.createNewUser);

router
  .route("/user/:id")
  .get(usersController.getSingleUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

module.exports = router;
