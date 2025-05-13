const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Suất chiếu phim
const TicketSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  cinemaName: { type: String },
  movieName: { type: String },
  caption: { type: String },
  imageMovie: { type: String },
  codeOrder: { type: String }, // Mã vé
  time: { type: String },
  date: { type: String }, // Ngày chiếu
  room: { type: String }, // Phòng chiếu
  seatNumbers: { type: String, required: true }, // VD: ["A1", "A2"]
  snacks: { type: String }, // Món ăn kèm
  cinemaAddress: { type: String }, // Địa chỉ rạp
  codeTransaction: { type: String }, // Mã giao dịch
  status: { type: String, enum: ["PENDING", "CONFIRMED", "CANCELLED"], default: "PENDING" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Mongoose sẽ tự động tạo collection "rooms" nếu chưa có
module.exports = mongoose.model("Ticket", TicketSchema);
