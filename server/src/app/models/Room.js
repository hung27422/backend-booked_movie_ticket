const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SeatSchema = new Schema({
  seatNumber: { type: Number, required: true }, // Ví dụ: "A1", "B2"
  isBooked: { type: Boolean, default: false }, // Mặc định chưa đặt
});

const RoomSchema = new Schema({
  name: { type: String, required: true, unique: true },
  cinemaId: { type: Schema.Types.ObjectId, ref: "Cinema" },
  seats: { type: [SeatSchema], required: true }, // Danh sách ghế
  type: { type: String, enum: ["DEFAULT", "VIP"], default: "DEFAULT" }, // Loại phòng
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Mongoose sẽ tự động tạo collection "rooms" nếu chưa có
module.exports = mongoose.model("Room", RoomSchema);
