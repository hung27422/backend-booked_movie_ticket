const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/booked_movies_ticket-dev", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connect Mongoose successfully!!!");
  } catch (error) {
    console.error("Connect failure!!!", error);
  }
}

module.exports = { connect };
