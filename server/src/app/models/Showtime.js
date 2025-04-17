const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Suất chiếu phim
const ShowtimeSchema = new Schema({
  movieId: { type: Schema.Types.ObjectId, ref: "Movie" },
  cinemaId: { type: Schema.Types.ObjectId, ref: "Cinema" },
  roomId: { type: Schema.Types.ObjectId, ref: "Room" },
  startTime: { type: Date, required: true }, // Thời gian bắt đầu
  endTime: { type: Date, required: true }, // Thời gian kết thúc
  price: { type: Number, required: true }, // Giá vé
  seatPricing: {
    SINGLE: { type: Number, default: 1 },
    DOUBLE: { type: Number, default: 1.8 },
  },
  availableSeats: { type: Number, required: true }, // Danh sách ghế còn trống
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Mongoose sẽ tự động tạo collection "rooms" nếu chưa có
module.exports = mongoose.model("ShowTime", ShowtimeSchema);
