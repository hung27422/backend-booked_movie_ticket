const Cinema = require("../models/Cinema");
const Room = require("../models/Room");
class CinemaController {
  // [GET] /api/cinemas/group-by-location?location=xxx
  async groupByLocation(req, res) {
    const { location } = req.query;

    try {
      const matchStage = location
        ? { $match: { location: { $regex: location, $options: "i" } } }
        : { $match: {} };

      const grouped = await Cinema.aggregate([
        matchStage,
        {
          // Nhóm theo location + cinemaCode
          $group: {
            _id: {
              location: "$location",
              cinemaCode: "$cinemaCode",
            },
            count: { $sum: 1 },
            image: { $first: "$image" }, // lấy 1 ảnh đầu tiên
            name: { $first: "$name" }, // lấy tên rạp đầu tiên nếu cần
            items: { $push: "$$ROOT" },
          },
        },
        {
          // Nhóm lại theo location
          $group: {
            _id: "$_id.location",
            total: { $sum: "$count" },
            cinemas: {
              $push: {
                cinemaCode: "$_id.cinemaCode",
                count: "$count",
                name: "$name",
                image: "$image", // đưa image ra ngoài
                items: "$items",
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            address: "$_id",
            total: 1,
            cinemas: 1,
            cinemas: {
              $sortArray: {
                input: "$cinemas",
                sortBy: { name: 1 }, // sắp xếp theo name A-Z
              },
            },
          },
        },
        { $sort: { address: 1 } },
      ]);

      res.status(200).json(grouped);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  // [GET] /api/cinemas/search-by-location?location=xxx
  async searchCinemaByLocation(req, res) {
    const { location } = req.query;

    if (!location) {
      return res.status(400).json({
        success: false,
        message: "Location is required to search",
      });
    }

    try {
      const cinemas = await Cinema.find({
        location: { $regex: location, $options: "i" }, // tìm gần đúng, không phân biệt hoa thường
      });

      res.json(cinemas);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  // [GET] /api/cinemas/search?name=xxx
  async searchCinemaByName(req, res) {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required to search",
      });
    }

    try {
      const cinemas = await Cinema.find({
        name: { $regex: name, $options: "i" }, // tìm gần đúng, không phân biệt hoa thường
      });

      res.json(cinemas);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  //[GET] /api/cinemas
  index(req, res) {
    Cinema.find({})
      .then((cinemas) => res.json(cinemas))
      .catch((error) => res.status(400).json({ error: error.message }));
  }
  // [POST] /api/cinemas
  async post(req, res) {
    const { name, cinemaCode, image, location, phone } = req.body;

    // Simple validation
    if (!name || !location) {
      return res.status(400).json({
        success: false,
        message: "Name, location are required",
      });
    }
    try {
      const newCinema = new Cinema({
        name,
        cinemaCode,
        image,
        location,
        phone,
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
    const { name, cinemaCode, image, location, phone } = req.body;
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
        image,
        cinemaCode,
        location,
        phone,
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
