const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Rạp chiếu phim
const CinemaSchema = new Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String },
  cinemaCode: { type: String, required: true },
  location: { type: String, required: true },
  phone: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Mongoose sẽ tự động tạo collection "cinemas" nếu chưa có
module.exports = mongoose.model("Cinema", CinemaSchema);
