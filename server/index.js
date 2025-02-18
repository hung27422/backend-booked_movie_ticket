const express = require("express");
const app = express();
const port = 5000;

const route = require("./src/routes/index");
const db = require("./src/configs/db/index");

app.use(express.json());

// Connect to database
db.connect();

// Routes init
route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
