const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SnackSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  type: {
    type: String,
    enum: ["COMBO", "SINGLE"],
    default: "SINGLE",
  },
  price: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true },
  cinemaId: { type: Schema.Types.ObjectId, ref: "Cinema" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Snack", SnackSchema);
