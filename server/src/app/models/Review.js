const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  movieId: { type: Schema.Types.ObjectId, ref: "Movie" },
  rating: { type: Number },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Mongoose sẽ tự động tạo collection "reviews" nếu chưa có
module.exports = mongoose.model("Review", ReviewSchema);