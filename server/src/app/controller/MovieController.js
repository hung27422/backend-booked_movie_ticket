const Movie = require("../models/Movie");
class MovieController {
  // [GET] /api/movies/search?title=abc
  async searchMovieByTitle(req, res) {
    const { title } = req.query;

    if (!title) {
      return res.status(400).json({ success: false, message: "Missing title query" });
    }

    try {
      // Tìm kiếm không phân biệt hoa thường, dùng biểu thức chính quy
      const movies = await Movie.find({
        title: { $regex: title, $options: "i" }, // "i" để không phân biệt hoa thường
      }).populate("user", "username");

      res.json(movies);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  //[GET] /api/movie/id
  async getMovieById(req, res) {
    const movieId = req.params.id;
    Movie.findById(movieId)
      .populate("user", "username fullName")
      .then((movie) => {
        if (!movie) {
          return res.status(404).json({
            success: false,
            message: "Movie not found",
          });
        }
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Lỗi server" });
      });
  }
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
      status,
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
        status,
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
      status,
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
        status,
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
  // [DELETE] /api/movies/:id
  async delete(req, res) {
    const { id } = req.params;
    try {
      const movieDeleteCondition = { _id: id };
      const deleteMovie = await Movie.findOneAndDelete(movieDeleteCondition);
      //User not authorised or movie not found
      if (!deleteMovie) {
        return res
          .status(401)
          .json({ success: false, message: "Movie not found or user not authorised" });
      }
      // Movie deleted successfully
      res.json({ success: true, message: "Movie deleted successfully", movie: deleteMovie });
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
