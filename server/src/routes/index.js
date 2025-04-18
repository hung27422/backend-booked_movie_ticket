const userRoute = require("./auht");
const movieRoute = require("./movie");
const cinemaRoute = require("./cinema");
const roomRoute = require("./room");
const showTimeRoute = require("./showtime");
const bookingRoute = require("./booking");
const paymentRoute = require("./payment");
const reviewRoute = require("./review");
const snackRoute = require("./snack");
const route = (app) => {
  //Home Router
  app.get("/", (req, res) => {
    res.send("SERVER ON");
  });
  //User Router
  app.use("/api/auth", userRoute);
  //Movie Router
  app.use("/api/movies", movieRoute);
  //Cinema Router
  app.use("/api/cinemas", cinemaRoute);
  // Room Router
  app.use("/api/rooms", roomRoute);
  // Showtime Router
  app.use("/api/showtimes", showTimeRoute);
  // Booking Router
  app.use("/api/bookings", bookingRoute);
  // Payment Router
  app.use("/api/payments", paymentRoute);
  // Review Router
  app.use("/api/reviews", reviewRoute);
  // Snack Router
  app.use("/api/snacks", snackRoute);
};
module.exports = route;
