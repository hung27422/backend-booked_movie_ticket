const Cinema = require("../models/Cinema");
const Room = require("../models/Room");
class CinemaController {
  //[GET] /api/cinemas
  index(req, res) {
    Cinema.find({})
      .populate("rooms", "name seats type")
      .then((cinemas) => res.json(cinemas))
      .catch((error) => res.status(400).json({ error: error.message }));
  }
  // [POST] /api/cinemas
  async post(req, res) {
    const { name, location, phone, rooms } = req.body;

    // Simple validation
    if (!name || !location || !rooms) {
      return res.status(400).json({
        success: false,
        message: "Name, location and rooms are required",
      });
    }
    try {
      const newCinema = new Cinema({
        name,
        location,
        phone,
        rooms,
      });
      await newCinema.save();
      // Create new cinema successfully
      res.json({ success: true, message: "Cinema created successfully", cinema: newCinema });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  // [PUT] /api/cinemas/:id
  async put(req, res) {
    const { id } = req.params;
    const { name, cinemaCode, location, phone, rooms } = req.body;
    // Simple validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name, location and rooms are required",
      });
    }
    try {
      let updateCinema = {
        name,
        cinemaCode,
        location,
        phone,
        rooms,
      };
      const cinemaUpdateCondition = { _id: id };
      updateCinema = await Cinema.findOneAndUpdate(cinemaUpdateCondition, updateCinema, {
        new: true,
      });
      // Update cinema successfully
      res.json({
        success: true,
        message: "Cinema updated successfully",
        cinema: updateCinema,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
  // [DELETE] /api/cinemas/:id
  async delete(req, res) {
    const { id } = req.params;
    try {
      const cinemaDeleteCondition = { _id: id };
      const deleteCinema = await Cinema.findOneAndDelete(cinemaDeleteCondition);
      if (!deleteCinema) {
        return res.status(404).json({
          success: false,
          message: "Cinema not found",
        });
      }
      // Delete related rooms
      await Room.deleteMany({ cinema: id });
      // Delete cinema successfully
      res.json({ success: true, message: "Cinema deleted successfully", cinema: deleteCinema });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}

module.exports = new CinemaController();
