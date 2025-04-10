const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../middleware/auth");
const roomController = require("../app/controller/RoomController");

// [GET] /api/rooms
router.get("/", roomController.index);
// [GET] /api/rooms/:idCinemas
router.get("/:idCinemas", roomController.getRoomsByCinemaId);
// [DELETE] /api/rooms/:id
router.delete("/:id", verifyToken, verifyAdmin, roomController.delete);
// [PUT] /api/rooms/:id
router.put("/:id", verifyToken, verifyAdmin, roomController.put);
// [POST] /api/rooms
router.post("/", verifyToken, verifyAdmin, roomController.post);

module.exports = router;
