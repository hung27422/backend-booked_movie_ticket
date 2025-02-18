const Movie = require("../models/Movie");
class MovieController {
  //[GET] /api/movies
  index(req, res) {
    Movie.find({})
      .populate("user", "username")
      .then((movies) => res.json(movies)) // ✅ Return list movie
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Lỗi server" });
      });
  }
  // [POST] /api/movies
  async post(req, res) {
    const {
      title,
      description,
      duration,
      genre,
      releaseDate,
      director,
      cast,
      poster,
      trailer,
      rating,
      ageRate,
      country,
      caption,
    } = req.body;
    const userId = req.userId;
    // Simple validation
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title or description is required",
      });
    }

    try {
      const newMovie = new Movie({
        title,
        description,
        duration,
        genre,
        releaseDate,
        director,
        cast,
        poster,
        trailer,
        rating,
        ageRate,
        country,
        caption,
        user: userId,
      });

      await newMovie.save();

      res.json({
        success: true,
        message: "Movie created successfully",
        movie: newMovie,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
  // [PUT] /api/movies/:id
  async put(req, res) {
    const { id } = req.params;
    const {
      title,
      description,
      duration,
      genre,
      releaseDate,
      director,
      cast,
      poster,
      trailer,
      rating,
      ageRate,
      country,
      caption,
    } = req.body;
    // Simple validation
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title or description is required",
      });
    }
    try {
      let updateMovie = {
        title,
        description,
        duration,
        genre,
        releaseDate,
        director,
        cast,
        poster,
        trailer,
        rating,
        ageRate,
        country,
        caption,
      };
      const movieUpdateCondition = { _id: id };
      updateMovie = await Movie.findOneAndUpdate(movieUpdateCondition, updateMovie, { new: true });
      //User not authorised to update movie or movie not found
      if (!updateMovie) {
        return res
          .status(401)
          .json({ success: false, message: "Movie not found or user not authorised" });
      }
      // Movie updated successfully
      res.json({
        success: true,
        message: "Movie updated successfully",
        movie: updateMovie,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}
module.exports = new MovieController();
