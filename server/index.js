const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const route = require("./src/routes/index");
const db = require("./src/configs/db/index");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to database
db.connect();

// Routes init
route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
