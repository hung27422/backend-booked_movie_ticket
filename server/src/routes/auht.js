const express = require("express");
const router = express.Router();
const userController = require("../app/controller/UserController");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

// [POST] /api/auth/loginAdmin
router.post("/loginAdmin", userController.loginAdmin);
// [POST] /api/auth/login
router.post("/login", userController.login);
// [POST] /api/auth/register
router.post("/register", userController.register);
//[GET] /api/auth/All
router.get("/all", userController.getAllUsers);
// [GET] /api/auth
router.use("/", verifyToken, userController.index);
// [GET] /api/auth/authAdmin
router.use("/admin", verifyAdmin, userController.indexAdmin);

module.exports = router;
