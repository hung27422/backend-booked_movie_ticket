const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  showtimeId: { type: Schema.Types.ObjectId, ref: "ShowTime", required: true },
  seatNumbers: [{ type: String, required: true }], // VD: ["A1", "A2"]
  snacks: [
    {
      snackId: { type: Schema.Types.ObjectId, ref: "Snack" },
      quantity: { type: Number, default: 1 },
      price: { type: Number }, // giá theo thời điểm đặt
      subtotal: { type: Number }, // quantity * price
    },
  ],
  ticketPrice: { type: Number, required: true }, // Giá vé 1 ghế (đơn vị: VNĐ)
  totalPrice: { type: Number, required: true }, // Tổng: vé + snack
  status: {
    type: String,
    enum: ["PENDING", "CONFIRMED", "CANCELLED"],
    default: "PENDING",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Booking", BookingSchema);
