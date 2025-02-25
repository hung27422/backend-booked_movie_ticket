const express = require("express");
const router = express.Router();
const bookingController = require("../app/controller/BookingController");
const { verifyToken } = require("../middleware/auth");
// [GET] /api/bookings
router.get("/", bookingController.index);
//[PUT] /api/bookings/:id
router.put("/:id", verifyToken, bookingController.put);
//[DELETE] /api/bookings/:id
router.delete("/:id", verifyToken, bookingController.delete);
// [POST] /api/bookings
router.post("/", verifyToken, bookingController.post);
module.exports = router;
