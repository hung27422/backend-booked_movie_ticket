const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../middleware/auth");
const roomController = require("../app/controller/RoomController");

// [GET] /api/rooms
router.get("/getAll", roomController.index);
// [GET] /api/rooms?page=1&limit=10
router.get("/", roomController.getRoomByPageAndLimit);
// [GET] /api/rooms/by-cinema?cinemaId=xxx
router.get("/by-cinema", roomController.getRoomsByCinemaId);
// [GET] /api/rooms/:id
router.get("/:id", roomController.getRoomById);
// [GET] /api/rooms/:roomId/details
router.get("/:roomId/details", roomController.getRoomDetails);

// [DELETE] /api/rooms/:id
router.delete("/:id", verifyToken, verifyAdmin, roomController.delete);
// [PUT] /api/rooms/:id
router.put("/:id", verifyToken, verifyAdmin, roomController.put);
// [PATCH] /api/rooms/:id/update-seats
router.patch("/:id/update-seats", roomController.updateBookedSeats);
// [POST] /api/rooms
router.post("/", verifyToken, verifyAdmin, roomController.post);

module.exports = router;
