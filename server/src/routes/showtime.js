const express = require("express");
const router = express.Router();
const showTimeController = require("../app/controller/ShowtimeController");
// [GET] /api/movies
router.get("/", showTimeController.index);
// [DELETE] /api/showtimes/:id
router.delete("/:id", showTimeController.delete);
//[PUT] /api/showtimes/:id
router.put("/:id", showTimeController.put);
// [POST] /api/showtimes
router.post("/", showTimeController.post);
module.exports = router;
