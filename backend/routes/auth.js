const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const loginLimiter = require("../middleware/loginLimiter");
const { METHOD, PATH } = require("../constants/index");

const authRoutes = [
  {
    method: METHOD.POST,
    path: PATH.LOGIN,
    middleware: [loginLimiter],
    handler: userController.login,
  },
  {
    method: METHOD.GET,
    path: PATH.REFRESH,
    middleware: [],
    handler: userController.refresh,
  },
  {
    method: METHOD.POST,
    path: PATH.LOGOUT,
    middleware: [],
    handler: userController.logout,
  },
];

authRoutes.forEach((route) => {
  const { method, path, middleware, handler } = route;
  router[method](path, ...middleware, handler);
});

module.exports = router;
