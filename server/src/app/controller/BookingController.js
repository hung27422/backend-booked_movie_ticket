const Booking = require("../models/Booking");
const Showtime = require("../models/Showtime");

class BookingController {
  //[GET] /api/bookings
  index(req, res) {
    Booking.find({})
      .populate("userId", "username email")
      .populate("showtimeId")
      .populate("snacks.snackId")
      .then((bookings) => res.json(bookings))
      .catch((error) => res.status(400).json({ error: error.message }));
  }

  // [GET] /api/bookings/:id
  async show(req, res) {
    const { id } = req.params;

    try {
      const booking = await Booking.findById(id)
        .populate("userId", "username email")
        .populate("showtimeId")
        .populate("snacks.snackId");
      if (!booking) {
        return res.status(404).json({ success: false, message: "Không tìm thấy đơn đặt vé" });
      }

      res.json(booking);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // [POST] /api/bookings
  async post(req, res) {
    const {
      userId,
      showtimeId,
      seatNumbers,
      ticketPrice,
      snacks = [],
      status = "PENDING",
    } = req.body;

    if (!userId || !showtimeId || !seatNumbers || !ticketPrice) {
      return res.status(400).json({ msg: "Vui lòng điền đầy đủ thông tin" });
    }

    try {
      // Tính tổng tiền snack
      const snacksWithSubtotal = snacks.map((snack) => {
        const subtotal = snack.quantity * snack.price;
        return { ...snack, subtotal };
      });
      // Tổng tiền ghế
      const seatTotal = seatNumbers.length * ticketPrice;
      // Tổng tiền tất cả
      const snackTotal = snacksWithSubtotal.reduce((sum, s) => sum + s.subtotal, 0);
      const totalPrice = seatTotal + snackTotal;

      const newBooking = new Booking({
        userId,
        showtimeId,
        seatNumbers,
        ticketPrice,
        snacks: snacksWithSubtotal,
        totalPrice,
        status,
      });

      await newBooking.save();

      res.json({
        success: true,
        message: "Đặt vé thành công",
        booking: newBooking,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // [PUT] /api/bookings/:id
  async put(req, res) {
    const { id } = req.params;
    const { userId, showtimeId, seatNumbers, ticketPrice, snacks = [], status } = req.body;

    if (!userId || !showtimeId || !seatNumbers || !ticketPrice) {
      return res.status(400).json({ msg: "Vui lòng điền đầy đủ thông tin" });
    }

    try {
      const snacksWithSubtotal = snacks.map((snack) => {
        const subtotal = snack.quantity * snack.price;
        return { ...snack, subtotal };
      });

      const seatTotal = seatNumbers.length * ticketPrice;
      const snackTotal = snacksWithSubtotal.reduce((sum, s) => sum + s.subtotal, 0);
      const totalPrice = seatTotal + snackTotal;

      const updatedBooking = await Booking.findByIdAndUpdate(
        id,
        {
          userId,
          showtimeId,
          seatNumbers,
          ticketPrice,
          snacks: snacksWithSubtotal,
          totalPrice,
          status,
          updatedAt: new Date(),
        },
        { new: true }
      );

      if (!updatedBooking) {
        return res.status(404).json({ success: false, message: "Không tìm thấy đơn đặt vé" });
      }

      res.json({
        success: true,
        message: "Cập nhật đơn đặt vé thành công",
        booking: updatedBooking,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  // [PATCH] /api/bookings/:id/status
  async updateStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ msg: "Vui lòng cung cấp trạng thái mới" });
    }

    try {
      const updatedBooking = await Booking.findByIdAndUpdate(
        id,
        { status, updatedAt: new Date() },
        { new: true }
      );

      if (!updatedBooking) {
        return res.status(404).json({ success: false, message: "Không tìm thấy đơn đặt vé" });
      }

      res.json({
        success: true,
        message: "Cập nhật trạng thái thành công",
        booking: updatedBooking,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // [DELETE] /api/bookings/:id
  async delete(req, res) {
    const { id } = req.params;

    try {
      const deletedBooking = await Booking.findByIdAndDelete(id);

      if (!deletedBooking) {
        return res.status(404).json({ success: false, message: "Không tìm thấy đơn đặt vé" });
      }

      res.json({
        success: true,
        message: "Xóa đơn đặt vé thành công",
        booking: deletedBooking,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new BookingController();
