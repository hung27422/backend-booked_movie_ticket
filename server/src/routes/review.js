const express = require("express");
const router = express.Router();
const reviewController = require("../app/controller/ReviewController");

// [GET] /api/reviews
router.get("/", reviewController.index);
// [DELETE] /api/reviews/:id
router.delete("/:id", reviewController.delete);
// [PUT] /api/reviews/:id
router.put("/:id", reviewController.put);
// [POST] /api/reviews
router.post("/", reviewController.post);

module.exports = router;
