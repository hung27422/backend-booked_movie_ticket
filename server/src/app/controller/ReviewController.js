const Review = require("../models/Review");
class ReviewController {
  // [GET] /api/reviews
  async index(req, res) {
    Review.find({})
      .populate("userId", "username")
      .populate("movieId", "title")
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        res.status(400).json({ error: error.message });
      });
    // res.send("ReviewController index");
  }
  // [POST] /api/reviews
  async post(req, res) {
    const { userId, movieId, rating, comment } = req.body;
    // Simple validation
    if (!userId || !movieId || !rating || !comment) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }
    try {
      const newReview = new Review({
        userId,
        movieId,
        rating,
        comment,
      });
      await newReview.save();
      // Create new review successfully
      res.json({ success: true, message: "Review created successfully", review: newReview });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  // [PUT] /api/reviews/:id
  async put(req, res) {
    const { id } = req.params;
    const { userId, movieId, rating, comment } = req.body;
    // Simple validation
    if (!userId || !movieId || !rating || !comment) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }
    try {
      let updateReview = {
        userId,
        movieId,
        rating,
        comment,
      };
      const reviewUpdateCondition = { _id: id };

      updateReview = await Review.findOneAndUpdate(reviewUpdateCondition, updateReview, {
        new: true,
      });
      // Update review successfully
      res.json({ success: true, message: "Review updated successfully", review: updateReview });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // [DELETE] /api/reviews/:id
  async delete(req, res) {
    const { id } = req.params;
    try {
      const deleteReviewCondition = { _id: id };
      const deleteReview = await Review.findOneAndDelete(deleteReviewCondition);
      // Delete review successfully
      res.json({ success: true, message: "Review deleted successfully", review: deleteReview });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new ReviewController();
