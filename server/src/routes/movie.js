const express = require("express");
const router = express.Router();
const movieController = require("../app/controller/MovieController");
const { verifyAdmin, verifyToken } = require("../middleware/auth");
// [GET] /api/movies
router.get("/", movieController.index);
//[DELETE] /api/movies/:id
router.delete("/:id", verifyToken, verifyAdmin, movieController.delete);
// [PUT] /api/movies/:id
router.put("/:id", verifyToken, verifyAdmin, movieController.put);
// [POST] /api/movies
router.use("/", verifyToken, verifyAdmin, movieController.post);

module.exports = router;
