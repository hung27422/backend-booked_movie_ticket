const express = require("express");
const router = express.Router();
const userController = require("../app/controller/UserController");

// [POST] /api/auth/login
router.post("/login", userController.login);
// [POST] /api/auth/register
router.post("/register", userController.register);
// [GET] /api/auth
router.use("/", userController.index);

module.exports = router;
