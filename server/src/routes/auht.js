const express = require("express");
const router = express.Router();
const userController = require("../app/controller/UserController");

router.post("/login", userController.login);
router.post("/register", userController.register);
router.use("/", userController.index);

module.exports = router;
