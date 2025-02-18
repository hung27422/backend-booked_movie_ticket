const express = require("express");
const router = express.Router();
const movieController = require("../app/controller/MovieController");
const verifyToken = require("../middleware/auth");
// [POST] /api/movies
router.use("/", verifyToken, movieController.post);
// [GET] /api/movies
// router.use("/", movieController.index);

module.exports = router;
