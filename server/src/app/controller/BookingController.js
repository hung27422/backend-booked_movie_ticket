const Booking = require("../models/Booking");

class BookingController {
  //[GET] /api/bookings
  index(req, res) {
    Booking.find({})
      .populate("userId", "username email")
      .then((bookings) => res.json(bookings))
      .catch((error) => res.status(400).json({ error: error.message }));
  }
  // [POST] /api/bookings
  async post(req, res) {
    const { userId, showtimeId, seatNumbers, status } = req.body;
    // Simple validation
    if (!userId || !showtimeId || !seatNumbers) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }
    try {
      const newBooking = new Booking({
        userId,
        showtimeId,
        seatNumbers,
        status,
      });
      await newBooking.save();
      // Create new booking successfully
      res.json({ success: true, message: "Booking created successfully", booking: newBooking });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  // [PUT] /api/bookings/:id
  async put(req, res) {
    const { id } = req.params;
    const { userId, showtimeId, seatNumbers, status } = req.body;
    // Simple validation
    if (!userId || !showtimeId || !seatNumbers) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }
    try {
      let updateBooking = {
        userId,
        showtimeId,
        seatNumbers,
        status,
      };
      const bookingUpdateCondition = { _id: id };

      updateBooking = await Booking.findOneAndUpdate(bookingUpdateCondition, updateBooking, {
        new: true,
      });
      // Update booking successfully
      res.json({ success: true, message: "Booking updated successfully", booking: updateBooking });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  // [DELETE] /api/bookings/:id
  async delete(req, res) {
    const { id } = req.params;
    try {
      const deleteBooking = await Booking.findByIdAndDelete(id);
      if (!deleteBooking) {
        res.json({ success: false, message: "Booking not found" });
      }
      // Delete booking successfully
      res.json({ success: true, message: "Booking deleted successfully", booking: deleteBooking });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new BookingController();
