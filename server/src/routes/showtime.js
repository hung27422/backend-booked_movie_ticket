const express = require("express");
const router = express.Router();
const showTimeController = require("../app/controller/ShowtimeController");

// [GET] /api/showtime/group-by-location?movieId=xxx
router.get("/group-by-location", showTimeController.getCinemasByMovieID);

// [GET] /api/showtimes/getAll
router.get("/getAll", showTimeController.index);

// [GET] /api/showtimes/filter-by-cinema-date?cinemaId=xxx&releaseDate=yyyy-mm-dd
router.get("/filter-by-cinema-date", showTimeController.filterByCinemaAndReleaseDate);

// [GET] /api/showtimes/filter?roomId=xxx&movieId=yyy
router.get("/filter", showTimeController.getShowTimeByRoomAndMovie);

// [GET] /api/showtimes/room/:roomId
router.get("/room/:roomId", showTimeController.getShowTimeByRoomId);

//  [GET] api/showtimes?page=1&limit=10
router.get("/", showTimeController.getShowTimeByPageAndLimit);

// [GET] /api/showtimes/:id
router.get("/:id", showTimeController.getShowTimeById);

// [DELETE] /api/showtimes/:id
router.delete("/:id", showTimeController.delete);

// [PUT] /api/showtimes/update-same-time
router.put("/update-same-time", showTimeController.updateShowTimesSameTime);

//[PUT] /api/showtimes/:id
router.put("/:id", showTimeController.put);

// [PATCH] /api/showtimes/:id/available-seats
router.patch("/:id/available-seats", showTimeController.updateAvailableSeats);

// [POST] /api/showtimes
router.post("/", showTimeController.post);

module.exports = router;
