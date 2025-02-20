const userRoute = require("./auht");
const movieRoute = require("./movie");
const cinemaRoute = require("./cinema");
const roomRoute = require("./room");
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
};
module.exports = route;
