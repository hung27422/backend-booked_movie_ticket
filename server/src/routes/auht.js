const express = require("express");
const router = express.Router();
const userController = require("../app/controller/UserController");

router.use("/", userController.index);

module.exports = router;
