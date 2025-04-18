const express = require("express");
const router = express.Router();
const showTimeController = require("../app/controller/ShowtimeController");

// [GET] /api/movies
router.get("/", showTimeController.index);
// [GET] /api/showtimes/filter-by-cinema-date?cinemaId=xxx&releaseDate=yyyy-mm-dd
router.get("/filter-by-cinema-date", showTimeController.filterByCinemaAndReleaseDate);
// [GET] /api/showtimes/filter?roomId=xxx&movieId=yyy
router.get("/filter", showTimeController.getShowTimeByRoomAndMovie);
// [GET] /api/showtimes/:id
router.get("/:id", showTimeController.getShowTimeById);
// [GET] /api/showtimes/room/:roomId
router.get("/room/:roomId", showTimeController.getShowTimeByRoomId);
// [DELETE] /api/showtimes/:id
router.delete("/:id", showTimeController.delete);
//[PUT] /api/showtimes/:id
router.put("/:id", showTimeController.put);
// [POST] /api/showtimes
router.post("/", showTimeController.post);

module.exports = router;
