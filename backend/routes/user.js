const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyJWT, authorizeRoles } = require("../middleware/verifyJWT");
const { METHOD, PATH, ROLE } = require("../constants/index");

router.use(verifyJWT);

const userRoutes = [
  {
    method: METHOD.GET,
    path: PATH.USERS,
    roles: [ROLE.ADMIN],
    handler: userController.getAllUsers,
  },
  {
    method: METHOD.POST,
    path: PATH.USERS,
    roles: [ROLE.ADMIN],
    handler: userController.createNewUser,
  },
  {
    method: METHOD.GET,
    path: PATH.USER_ID,
    roles: [ROLE.ADMIN],
    handler: userController.getSingleUser,
  },
  {
    method: METHOD.PATCH,
    path: PATH.USER_ID,
    roles: [ROLE.ADMIN],
    handler: userController.updateUser,
  },
  {
    method: METHOD.DELETE,
    path: PATH.USER_ID,
    roles: [ROLE.ADMIN],
    handler: userController.deleteUser,
  },
];

userRoutes.forEach((route) => {
  const { method, path, roles, handler } = route;
  router[method](path, authorizeRoles(...roles), handler);
});

module.exports = router;
