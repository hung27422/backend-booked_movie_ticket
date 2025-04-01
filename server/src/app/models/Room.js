const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SeatSchema = new Schema({
  seatNumber: { type: String, required: true }, // Ví dụ: "A1", "B2"
  isBooked: { type: Boolean, default: false }, // Mặc định chưa đặt
  type: { type: String, enum: ["SINGLE", "DOUBLE", "AISLE"], default: "SINGLE" }, // Loại ghế
  position: { type: { row: Number, col: Number }, required: true }, // Vị trí hàng và cột
});

const RoomSchema = new Schema({
  name: { type: String, required: true, unique: true },
  cinemaId: { type: Schema.Types.ObjectId, ref: "Cinema" },
  seats: { type: [SeatSchema], required: true }, // Danh sách ghế
  type: { type: String, enum: ["DEFAULT", "VIP"], default: "DEFAULT" }, // Loại phòng
  doubleSeatRow: { type: [Number], default: [] }, // 🟢 Thêm số hàng ghế đôi
  aisleCols: { type: [String], default: [] }, // 🟢 Thêm khoảng cách ghế
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Mongoose sẽ tự động tạo collection "rooms" nếu chưa có
module.exports = mongoose.model("Room", RoomSchema);
