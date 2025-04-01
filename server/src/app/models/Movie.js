const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  duration: { type: Number },
  genre: { type: [String] }, // Thể loại
  releaseDate: { type: Date },
  director: { type: String },
  cast: { type: [String] }, // Diễn viên
  poster: { type: String },
  trailer: { type: String },
  rating: { type: Number }, // Đánh giá 
  ageRate: { type: Number }, // Độ tuổi
  country: { type: String }, // Quốc gia
  caption: { type: String }, // Phụ đề
  status: {
    type: String,
    enum: ["NOWSHOWING", "COMINGSOON", "TEMPORARILYCLOSED"],
    default: "NOWSHOWING",
  },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Mongoose sẽ tự động tạo collection "movies" nếu chưa có
module.exports = mongoose.model("Movie", MovieSchema);
