const mongoose = require("mongoose");
//mongodb://127.0.0.1:27017/booked_movies_ticket-dev
async function connect() {
  try {
    await mongoose.connect(
      "mongodb+srv://tanhungho2002:Aa123456789!@booked-movies-ticket-de.0pdhu76.mongodb.net/booked_movies_ticket-dev-clt?retryWrites=true&w=majority&appName=booked-movies-ticket-dev",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connect Mongoose successfully!!!");
  } catch (error) {
    console.error("Connect failure!!!", error);
  }
}

module.exports = { connect };
