const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Rạp chiếu phim
const CinemaSchema = new Schema({
  name: { type: String, required: true, unique: true },
  cinemaCode: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  phone: { type: String },
  rooms: [{ type: Schema.Types.ObjectId, ref: "Room" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Mongoose sẽ tự động tạo collection "cinemas" nếu chưa có
module.exports = mongoose.model("Cinema", CinemaSchema);
