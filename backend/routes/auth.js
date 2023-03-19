const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
// const loginLimiter = require("../middleware/loginLimiter");

router.route("/login").post(userController.login);

// router.route("/").post(loginLimiter, authController.login);

router.route("/refresh").get(userController.refresh);

router.route("/logout").post(userController.logout);

module.exports = router;
