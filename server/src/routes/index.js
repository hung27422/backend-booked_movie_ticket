const userRoute = require("./auht");
const route = (app) => {
  app.get("/", (req, res) => {
    res.send("SERVER ON");
  });
  app.use("/api/auth", userRoute);
};
module.exports = route;
