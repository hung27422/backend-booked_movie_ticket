const Ticket = require("../models/Ticket");

class TicketController {
  // [GET] /api/tickets
  async index(req, res) {
    try {
      const tickets = await Ticket.find({}).sort({ createdAt: -1 });
      res.json(tickets);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // [GET] /api/tickets/:id
  async show(req, res) {
    const { id } = req.params;
    try {
      const ticket = await Ticket.findById(id).sort({ createdAt: -1 });
      if (!ticket) {
        return res.status(404).json({ success: false, message: "Không tìm thấy vé" });
      }
      res.json(ticket);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  // [GET] /api/tickets/user/:userId
  async getTicketByUser(req, res) {
    const { userId } = req.params;

    try {
      const tickets = await Ticket.find({ userId })
        .populate("userId", "username email")
        .sort({ createdAt: -1 });

      if (!tickets || tickets.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy vé của người dùng này" });
      }
      res.json(tickets);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // [POST] /api/tickets
  async post(req, res) {
    try {
      const {
        userId,
        cinemaName,
        movieName,
        caption,
        imageMovie,
        imageCinema,
        codeOrder,
        time,
        date,
        room,
        seatNumbers,
        snacks,
        cinemaAddress,
        codeTransaction,
        urlQrCode,
        status,
      } = req.body;

      if (!seatNumbers || !codeOrder || !codeTransaction) {
        return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc" });
      }
      // ✅ Kiểm tra xem codeOrder hoặc codeTransaction đã tồn tại chưa
      const existingTicket = await Ticket.findOne({
        $or: [{ codeOrder }, { codeTransaction }],
      });

      if (existingTicket) {
        return res.status(400).json({
          success: false,
          message: "Vé với mã đơn hàng hoặc mã giao dịch đã tồn tại",
        });
      }
      const newTicket = new Ticket({
        userId,
        cinemaName,
        movieName,
        caption,
        imageMovie,
        imageCinema,
        codeOrder,
        time,
        date,
        room,
        seatNumbers,
        snacks,
        cinemaAddress,
        codeTransaction,
        urlQrCode,
        status,
      });

      await newTicket.save();
      res.status(201).json({
        success: true,
        message: "Tạo vé thành công",
        ticket: newTicket,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // [PUT] /api/tickets/:id
  async put(req, res) {
    const { id } = req.params;
    try {
      const {
        userId,
        cinemaName,
        movieName,
        caption,
        imageMovie,
        imageCinema,
        codeOrder,
        time,
        date,
        room,
        seatNumbers,
        snacks,
        cinemaAddress,
        codeTransaction,
        urlQrCode,
        status,
      } = req.body;

      const updatedTicket = await Ticket.findByIdAndUpdate(
        id,
        {
          userId,
          cinemaName,
          movieName,
          imageCinema,
          caption,
          imageMovie,
          codeOrder,
          time,
          date,
          room,
          seatNumbers,
          snacks,
          cinemaAddress,
          codeTransaction,
          urlQrCode,
          status,
          updatedAt: new Date(),
        },
        { new: true }
      );

      if (!updatedTicket) {
        return res.status(404).json({ success: false, message: "Không tìm thấy vé để cập nhật" });
      }

      res.json({
        success: true,
        message: "Cập nhật vé thành công",
        ticket: updatedTicket,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // [DELETE] /api/tickets/:id
  async delete(req, res) {
    const { id } = req.params;
    try {
      const deletedTicket = await Ticket.findByIdAndDelete(id);
      if (!deletedTicket) {
        return res.status(404).json({ success: false, message: "Không tìm thấy vé để xóa" });
      }

      res.json({
        success: true,
        message: "Xóa vé thành công",
        ticket: deletedTicket,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new TicketController();
