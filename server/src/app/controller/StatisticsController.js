const Booking = require("../models/Booking");
const Showtime = require("../models/Showtime");
const Ticket = require("../models/Ticket");
class StatisticsController {
  async getStatistics(req, res) {
    let { from, to } = req.query;

    try {
      // Nếu không truyền from/to thì mặc định là từ đầu tháng tới cuối tháng hiện tại
      if (!from || !to) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);

        from = startOfMonth;
        to = endOfMonth;
      } else {
        from = new Date(from);
        to = new Date(to);
        to.setHours(23, 59, 59, 999);
      }

      // Booking có status CONFIRMED trong khoảng thời gian
      const bookings = await Booking.find({
        createdAt: { $gte: from, $lte: to },
        status: "CONFIRMED",
      }).populate({
        path: "showtimeId",
        populate: { path: "roomId" },
      });
      const tickets = await Ticket.find({
        createdAt: { $gte: from, $lte: to },
        status: "PENDING",
      });
      const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
      const totalTicketsSold = tickets.reduce((sum, ticket) => {
        const seats =
          typeof ticket.seatNumbers === "string"
            ? ticket.seatNumbers.split(" - ")
            : ticket.seatNumbers || [];
        return sum + seats.length;
      }, 0);

      const showtimes = await Showtime.find({
        startTime: { $gte: from, $lte: to },
      }).populate({
        path: "roomId",
        select: "seats name",
      });

      const confirmedBookings = await Booking.find({
        createdAt: { $gte: from, $lte: to },
        status: "CONFIRMED",
      }).populate("showtimeId");

      const roomStatsMap = {}; // { roomId_dateKey: { emptySeats: x, date, roomId, roomName } }

      for (const showtime of showtimes) {
        const roomId = showtime.roomId?._id?.toString();
        const roomName = showtime.roomId?.name || "Không rõ";

        // Lấy ngày của suất chiếu (YYYY-MM-DD)
        const date = new Date(showtime.startTime);
        const dateKey = date.toISOString().split("T")[0]; // "2025-06-10"

        const mapKey = `${roomId}_${dateKey}`;

        const totalSeats = showtime.roomId?.seats?.length || 0;

        // Tính số ghế đã đặt trong suất chiếu này
        const showtimeBookings = confirmedBookings.filter(
          (b) => b.showtimeId?._id.toString() === showtime._id.toString()
        );

        let bookedCount = 0;
        showtimeBookings.forEach((b) => {
          bookedCount += b.seatNumbers?.length || 0;
        });

        if (!roomStatsMap[mapKey]) {
          roomStatsMap[mapKey] = {
            date: dateKey,
            roomId,
            roomName,
            totalSeats,
            bookedSeats: bookedCount,
          };
        } else {
          // Nếu trong cùng ngày có nhiều suất ở cùng phòng, cộng dồn ghế đã đặt
          roomStatsMap[mapKey].bookedSeats += bookedCount;
        }
      }

      const roomStats = Object.values(roomStatsMap).map((stat) => ({
        date: stat.date,
        roomId: stat.roomId,
        roomName: stat.roomName,
        totalSeats: stat.totalSeats,
        bookedSeats: stat.bookedSeats,
        emptySeats: stat.totalSeats - stat.bookedSeats,
      }));
      const emptySeatsCount = roomStats.reduce((sum, stat) => sum + stat.emptySeats, 0);
      res.json({
        success: true,
        data: {
          from,
          to,
          totalRevenue,
          totalTicketsSold,
          emptySeats: emptySeatsCount,
          totalShowtimes: showtimes.length,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
  // [GET] /api/statistics/hot-movies
  async getHotMovies(req, res) {
    let { from, to } = req.query;

    try {
      if (!from || !to) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);

        from = startOfMonth;
        to = endOfMonth;
      } else {
        from = new Date(from);
        to = new Date(to);
        to.setHours(23, 59, 59, 999);
      }

      const bookings = await Booking.find({
        createdAt: { $gte: from, $lte: to },
        status: { $in: ["CONFIRMED"] },
      }).populate({
        path: "showtimeId",
        populate: { path: "movieId" },
      });

      const movieMap = {};

      bookings.forEach((booking) => {
        const movie = booking.showtimeId?.movieId;
        if (!movie) return;

        const movieId = movie._id.toString();
        const seatCount = booking.seatNumbers?.length || 0;

        if (!movieMap[movieId]) {
          movieMap[movieId] = {
            movie,
            totalSeats: 0,
          };
        }

        movieMap[movieId].totalSeats += seatCount;
      });

      // Chuyển sang array và sắp xếp theo số ghế giảm dần
      const sortedMovies = Object.values(movieMap).sort((a, b) => b.totalSeats - a.totalSeats);

      res.json({
        success: true,
        from,
        to,
        hotMovies: sortedMovies
          .slice(0, 10) // Lấy 10 phim đầu tiên
          .map((item) => ({
            movie: item.movie,
            totalSeats: item.totalSeats,
          })),
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
  // [GET] /api/statistics/by-cinema
  async getBookingStatisticsByCinemas(req, res) {
    let { from, to } = req.query;

    try {
      if (!from || !to) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);
        from = startOfMonth;
        to = endOfMonth;
      } else {
        from = new Date(from);
        to = new Date(to);
        to.setHours(23, 59, 59, 999);
      }

      const bookings = await Booking.find({
        createdAt: { $gte: from, $lte: to },
        status: { $in: ["CONFIRMED"] },
      }).populate({
        path: "showtimeId",
        populate: {
          path: "cinemaId",
          select: "name", // chỉ lấy tên rạp
        },
      });

      let totalRevenue = 0;
      let totalSeats = 0;
      let totalBookings = bookings.length;

      // Gom nhóm theo tên rạp
      const cinemaStats = {};

      bookings.forEach((booking) => {
        const seatCount = booking.seatNumbers.length || 0;
        const revenue = booking.totalPrice || 0;

        totalRevenue += revenue;
        totalSeats += seatCount;

        const cinemaName = booking.showtimeId?.cinemaId?.name || "Không xác định";

        if (!cinemaStats[cinemaName]) {
          cinemaStats[cinemaName] = {
            cinemaName,
            totalRevenue: 0,
            totalSeats: 0,
            totalBookings: 0,
          };
        }

        cinemaStats[cinemaName].totalRevenue += revenue;
        cinemaStats[cinemaName].totalSeats += seatCount;
        cinemaStats[cinemaName].totalBookings += 1;
      });

      res.json({
        success: true,
        from,
        to,
        totalRevenue,
        totalSeats,
        totalBookings,
        cinemas: Object.values(cinemaStats),
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
module.exports = new StatisticsController();
