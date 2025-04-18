const Snack = require("../models/Snack");

class SnackController {
  // [GET] /api/snacks
  async getAllSnacks(req, res) {
    try {
      const snacks = await Snack.find({}).populate("cinemaId", "name"); // Lấy tất cả snack từ database
      res.json(snacks);
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
  // [POST] /api/snacks
  async createSnack(req, res) {
    const { name, description, type, price, cinemaId } = req.body;

    if (!name || !price) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
      const newSnack = new Snack({
        name,
        description,
        type,
        price,
        cinemaId,
      });

      await newSnack.save();
      res.json({ success: true, message: "Snack created", snack: newSnack });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }

  // [GET] /api/snacks/:cinemaId
  async getSnacksByCinema(req, res) {
    const { cinemaId } = req.params;

    try {
      const snacks = await Snack.find({ cinemaId });
      res.json({ success: true, snacks });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }

  // [PUT] /api/snacks/:id/update
  async updateSnack(req, res) {
    const { id } = req.params;
    const updateData = req.body;

    try {
      const updatedSnack = await Snack.findByIdAndUpdate(id, updateData, { new: true });
      if (!updatedSnack) {
        return res.status(404).json({ success: false, message: "Snack not found" });
      }
      res.json({ success: true, message: "Snack updated", snack: updatedSnack });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }

  // [DELETE] /api/snacks/:id/delete
  async deleteSnack(req, res) {
    const { id } = req.params;

    try {
      const deletedSnack = await Snack.findByIdAndDelete(id);
      if (!deletedSnack) {
        return res.status(404).json({ success: false, message: "Snack not found" });
      }
      res.json({ success: true, message: "Snack deleted", snack: deletedSnack });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
}

module.exports = new SnackController();
