const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  bookingId: { type: Schema.Types.ObjectId, ref: "Booking" },
  amount: { type: Number, required: true }, // Danh sách ghế còn trống
  paymentMethod: { type: String, enum: ["ATM", "CASH", "CREDIT_CARD"], required: true },
  status: {
    type: String,
    enum: ["PENDING", "COMPLETED", "FAILED"],
    default: "PENDING",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Mongoose sẽ tự động tạo collection "rooms" nếu chưa có
module.exports = mongoose.model("Payment", PaymentSchema);
