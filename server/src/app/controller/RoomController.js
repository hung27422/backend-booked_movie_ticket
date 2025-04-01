const { generateSeats } = require("../../utils/seatUtils");
const Room = require("../models/Room");
class RoomController {
  index(req, res) {
    Room.find({})
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
