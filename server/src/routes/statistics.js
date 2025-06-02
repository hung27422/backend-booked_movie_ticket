const express = require("express");
const router = express.Router();
const StatisticsController = require("../app/controller/StatisticsController");

// [GET] /api/statistics
router.get("/", StatisticsController.getStatistics);
//[GET] /api/statistics/hot-movies
router.get("/hot-movies", StatisticsController.getHotMovies);
// [GET] /api/statistics/by-cinemas
router.get("/by-cinemas", StatisticsController.getBookingStatisticsByCinemas);
module.exports = router;
