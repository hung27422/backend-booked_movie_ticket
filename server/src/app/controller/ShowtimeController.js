const ShowTime = require("../models/Showtime");

class ShowTimeController {
  // [GET] /api/showtimes
  index(req, res) {
    ShowTime.find({})
      .populate("movieId", "title")
      .populate("roomId", "name")
      .then((showtimes) => res.json(showtimes))
      .catch((error) => {
        res.status(400).json({ error: error.message });
      });
  }
  // [POST] /api/showtimes
  async post(req, res) {
    const { movieId, roomId, startTime, endTime, price, availableSeats } = req.body;
    // Simple validation
    if (!movieId || !roomId || !startTime || !endTime || !price || !availableSeats) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }
    try {
      const newShowTime = new ShowTime({
        movieId,
        roomId,
        startTime,
        endTime,
        price,
        availableSeats,
      });
      await newShowTime.save();
      // Create new showtime successfully
      res.json({ success: true, message: "ShowTime Created Successfully", showTime: newShowTime });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  // [PUT] /api/showtimes/:id
  async put(req, res) {
    const { id } = req.params;
    const { movieId, roomId, startTime, endTime, price, availableSeats } = req.body;
    // Simple validation
    if (!movieId || !roomId || !startTime || !endTime || !price || !availableSeats) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }
    try {
      let updateShowTime = {
        movieId,
        roomId,
        startTime,
        endTime,
        price,
        availableSeats,
      };
      const showTimeUpdateCondition = { _id: id };
      updateShowTime = await ShowTime.findOneAndUpdate(showTimeUpdateCondition, updateShowTime, {
        new: true,
      });
      if (!updateShowTime) {
        return res.status(404).json({ success: false, message: "Room not found" });
      }
      // Update showtime successfully
      res.json({
        success: true,
        message: "ShowTime Updated Successfully",
        showTime: updateShowTime,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  // [DELETE] /api/showtimes/:id
  async delete(req, res) {
    const { id } = req.params;
    try {
      const deleteShowTime = await ShowTime.findOneAndDelete({ _id: id });
      if (!deleteShowTime) {
        return res.status(404).json({ success: false, message: "ShowTime not found" });
      }
      // Delete showtime successfully
      res.json({
        success: true,
        message: "ShowTime Deleted Successfully",
        showTime: deleteShowTime,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new ShowTimeController();
