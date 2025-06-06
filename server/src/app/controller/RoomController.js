const { generateSeats } = require("../../utils/seatUtils");
const Room = require("../models/Room");
const ShowTime = require("../models/Showtime");
class RoomController {
  // [GET] api/rooms
  index(req, res) {
    Room.find({})
      .populate("cinemaId", "name") // Lấy thông tin cinemaId
      .then((rooms) => {
        // Xử lý từng room để thêm số hàng và số cột
        const updatedRooms = rooms.map((room) => {
          const seats = room.seats;
          const rows = Math.max(...seats.map((s) => s.position.row)); // Lấy hàng lớn nhất
          const cols = Math.max(...seats.map((s) => s.position.col)); // Lấy cột lớn nhất

          return {
            ...room.toObject(), // Chuyển Mongoose document thành Object
            rows,
            cols,
            doubleSeatRow: room.doubleSeatRow || 0, // Số hàng ghế đôi
            aisleCols: room.aisleCols || [], // Khoảng cách giữa ghế
          };
        });

        res.json(updatedRooms);
      })
      .catch((error) => {
        res.status(400).json({ error: error.message });
      });
  }
  // [GET] /api/rooms?page=1&limit=10
  getRoomByPageAndLimit(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    Promise.all([
      Room.find({}).populate("cinemaId", "name").skip(skip).limit(limit),
      Room.countDocuments(),
    ])
      .then(([rooms, totalItems]) => {
        // Xử lý từng room để thêm rows và cols
        const updatedRooms = rooms.map((room) => {
          const seats = room.seats || [];
          const rows = Math.max(...seats.map((s) => s.position.row), 0);
          const cols = Math.max(...seats.map((s) => s.position.col), 0);

          return {
            ...room.toObject(),
            rows,
            cols,
            doubleSeatRow: room.doubleSeatRow || 0,
            aisleCols: room.aisleCols || [],
          };
        });

        const totalPages = Math.ceil(totalItems / limit);

        res.json({
          data: updatedRooms,
          currentPage: page,
          totalPages,
          totalItems,
        });
      })
      .catch((error) => {
        console.error("Lỗi lấy danh sách phòng:", error);
        res.status(400).json({ error: error.message });
      });
  }

  // [GET] /api/rooms?cinemaId=<cinemaId>
  getRoomsByCinemaId(req, res) {
    const { cinemaId } = req.query; // ✅ Lấy từ query

    const query = cinemaId ? { cinemaId } : {};

    Room.find(query)
      .populate("cinemaId", "name")
      .then((rooms) => {
        const updatedRooms = rooms.map((room) => {
          const seats = room.seats;
          const rows = Math.max(...seats.map((s) => s.position.row));
          const cols = Math.max(...seats.map((s) => s.position.col));

          return {
            ...room.toObject(),
            rows,
            cols,
            doubleSeatRow: room.doubleSeatRow || 0,
            aisleCols: room.aisleCols || [],
          };
        });

        res.json(updatedRooms);
      })
      .catch((error) => {
        res.status(400).json({ error: error.message });
      });
  }

  // [GET] /api/rooms/:id
  async getRoomById(req, res) {
    const { id } = req.params;

    try {
      const room = await Room.findById(id).populate("cinemaId", "name");

      if (!room) {
        return res.status(404).json({ success: false, message: "Room not found" });
      }

      // Tính số hàng và số cột
      const rows = Math.max(...room.seats.map((s) => s.position.row));
      const cols = Math.max(...room.seats.map((s) => s.position.col));

      res.json({
        ...room.toObject(),
        rows,
        cols,
        doubleSeatRow: room.doubleSeatRow || 0,
        aisleCols: room.aisleCols || [],
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // [GET] /api/rooms/:roomId/details
  async getRoomDetails(req, res) {
    const { roomId } = req.params;

    try {
      // Tìm thông tin phòng
      const room = await Room.findById(roomId).populate("cinemaId", "name");
      if (!room) {
        return res.status(404).json({ success: false, message: "Room not found" });
      }

      // Tìm lịch chiếu trong phòng đó
      const showTimes = await ShowTime.find({ roomId })
        .populate("movieId", "title duration poster") // Lấy thông tin phim
        .sort({ startTime: 1 });

      res.json({
        success: true,
        room,
        movies: showTimes.map((show) => ({
          movie: show.movieId,
          startTime: show.startTime,
          showTimeId: show._id,
        })),
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // [POST] /api/Rooms
  async post(req, res) {
    const { name, cinemaId, rows, cols, aisleCols, doubleSeatRow, type } = req.body;

    // Simple validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name are required",
      });
    }
    try {
      const seats = generateSeats(rows, cols, aisleCols, doubleSeatRow);
      const newRoom = new Room({
        name,
        cinemaId,
        seats,
        type,
        rows,
        cols,
        doubleSeatRow,
        aisleCols,
      });
      await newRoom.save();
      // Create new Room successfully
      res.json({ success: true, message: "Room created successfully", room: newRoom });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  // [PUT] /api/rooms/:id
  async put(req, res) {
    const { id } = req.params;
    const { name, cinemaId, rows, cols, aisleCols, doubleSeatRow, type } = req.body;
    // Simple validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name are required",
      });
    }
    try {
      const seats = generateSeats(rows, cols, aisleCols, doubleSeatRow);
      let updateRoom = {
        name,
        cinemaId,
        seats,
        type,
      };
      const roomUpdateCondition = { _id: id };
      updateRoom = await Room.findOneAndUpdate(roomUpdateCondition, updateRoom, { new: true });
      if (!updateRoom) {
        return res.status(404).json({ success: false, message: "Room not found" });
      }
      // Update Room successfully
      res.json({ success: true, message: "Room updated successfully", room: updateRoom });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  // [PATCH] /api/rooms/:id/update-seats
  async updateBookedSeats(req, res) {
    const { id } = req.params; // roomId
    const { bookedSeats } = req.body; // danh sách các seatNumber cần đặt

    if (!Array.isArray(bookedSeats)) {
      return res.status(400).json({
        success: false,
        message: "bookedSeats must be an array of seat numbers",
      });
    }

    try {
      const room = await Room.findById(id);
      if (!room) {
        return res.status(404).json({ success: false, message: "Room not found" });
      }

      // Cập nhật trạng thái isBooked cho các ghế khớp
      room.seats = room.seats.map((seat) => {
        if (bookedSeats.includes(seat.seatNumber)) {
          return { ...seat.toObject(), isBooked: true };
        }
        return seat;
      });

      room.updatedAt = new Date();

      await room.save();

      res.json({
        success: true,
        message: "Seats updated successfully",
        room,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
  // [DELETE] /api/rooms/:id
  async delete(req, res) {
    const { id } = req.params;
    try {
      const roomDeleteCondition = { _id: id };
      const deleteRoom = await Room.findOneAndDelete(roomDeleteCondition);
      if (!deleteRoom) {
        return res.status(404).json({ success: false, message: "Room not found" });
      }
      // Delete Room successfully
      res.json({ success: true, message: "Room deleted successfully", room: deleteRoom });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new RoomController();
