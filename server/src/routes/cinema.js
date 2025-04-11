const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../middleware/auth");
const cinemaController = require("../app/controller/CinemaController");

// [GET] /api/cinemas/group-by-location
router.get("/group-by-location", cinemaController.groupByLocation);
// [GET] /api/cinemas/search-by-location?location=xxx
router.get("/search-by-location", cinemaController.searchCinemaByLocation);
// [GET] /api/cinemas/search?name=xxx
router.get("/search", cinemaController.searchCinemaByName);
// [GET] /api/cinemas
router.get("/", cinemaController.index);
// [DELETE] /api/cinemas/:id
router.delete("/:id", verifyToken, verifyAdmin, cinemaController.delete);
// [PUT] /api/cinemas/:id
router.put("/:id", verifyToken, verifyAdmin, cinemaController.put);
// [POST] /api/cinemas
router.post("/", verifyToken, verifyAdmin, cinemaController.post);

module.exports = router;
