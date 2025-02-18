const Movie = require("../models/Movie");
class MovieController {
  //[GET] /api/movies
  index(req, res) {
    res.send("Movie Route");
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
}
module.exports = new MovieController();
