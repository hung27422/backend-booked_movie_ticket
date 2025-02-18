const userRoute = require("./auht");
const movieRoute = require("./movie");
const route = (app) => {
  //Home Router
  app.get("/", (req, res) => {
    res.send("SERVER ON");
  });
  //User Router
  app.use("/api/auth", userRoute);
  //Movie Router
  app.use("/api/movies", movieRoute);
};
module.exports = route;
