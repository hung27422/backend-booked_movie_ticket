const userRoute = require("./auht");
const route = (app) => {
  app.get("/", (req, res) => {
    res.send("Hello World!");
  });
  app.use("/api/auth", userRoute);
};
module.exports = route;
