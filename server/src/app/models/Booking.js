const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  showtimeId: { type: Schema.Types.ObjectId, ref: "Showtime" },
  seatNumbers: [{ type: [String] }], // Danh sách ghế đã đặt
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ["PENDING", "CONFIRMED", "CANCELLED"],
    default: "PENDING",
  }, // Trạng thái đặt vé (pending, confirmed, cancelled)
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Booking", BookingSchema);
