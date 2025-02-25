const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SeatSchema = new Schema({
  seatNumber: { type: String, required: true }, // Ví dụ: "A1", "B2"
  isBooked: { type: Boolean, default: false }, // Mặc định chưa đặt
});
// Suất chiếu phim
const ShowtimeSchema = new Schema({
  movieId: { type: Schema.Types.ObjectId, ref: "Movie" },
  cinemaId: { type: Schema.Types.ObjectId, ref: "Cinema" },
  roomId: { type: Schema.Types.ObjectId, ref: "Room" },
  startTime: { type: Date, required: true }, // Thời gian bắt đầu
  endTime: { type: Date, required: true }, // Thời gian kết thúc
  price: { type: Number, required: true }, // Giá vé
  availableSeats: { type: Number, required: true }, // Danh sách ghế còn trống
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Mongoose sẽ tự động tạo collection "rooms" nếu chưa có
module.exports = mongoose.model("ShowTime", ShowtimeSchema);
