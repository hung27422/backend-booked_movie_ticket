const ShowTime = require("../models/Showtime");
const Movie = require("../models/Movie");
const Room = require("../models/Room");
const mongoose = require("mongoose");
class ShowTimeController {
  // [GET] /api/showtimes
  index(req, res) {
    ShowTime.find({})
      .populate("movieId", "title caption")
      .populate("roomId", "name")
      .populate("cinemaId", "name") // cần trường name để sort
      .lean()
      .then((showtimes) => {
        if (!showtimes.length || !showtimes[0].movieId) {
          return res.status(400).json({ msg: "Không thể lấy dữ liệu movie" });
        }

        // ✅ Sắp xếp showtimes theo tên rạp (cinemaId.name)
        showtimes.sort((a, b) => {
          const nameA = a.cinemaId?.name?.toLowerCase() || "";
          const nameB = b.cinemaId?.name?.toLowerCase() || "";
          return nameA.localeCompare(nameB); // tăng dần (A -> Z), dùng -1 để giảm dần
        });

        // ✅ Định dạng dữ liệu
        const formattedShowtimes = showtimes.map((showtime) => ({
          _id: showtime._id,
          movie: showtime.movieId,
          room: showtime.roomId,
          cinema: showtime.cinemaId,
          startTime: showtime.startTime,
          endTime: showtime.endTime,
          price: showtime.price,
          availableSeats: showtime.availableSeats,
          seatPricing: showtime.seatPricing,
          createdAt: showtime.createdAt,
          updatedAt: showtime.updatedAt,
        }));

        res.json(formattedShowtimes);
      })
      .catch((error) => {
        res.status(400).json({ error: error.message });
      });
  }

  // [GET] /api/showtimes/:id
  async getShowTimeById(req, res) {
    const { id } = req.params;

    try {
      const showtime = await ShowTime.findById(id)
        .populate("movieId", "title caption poster")
        .populate("roomId", "name seats")
        .populate("cinemaId", "name location image");

      if (!showtime) {
        return res.status(404).json({ msg: "Không tìm thấy suất chiếu với ID đã cho" });
      }

      res.json({
        _id: showtime._id,
        movie: showtime.movieId,
        room: showtime.roomId,
        cinema: showtime.cinemaId,
        startTime: showtime.startTime,
        endTime: showtime.endTime,
        price: showtime.price,
        availableSeats: showtime.availableSeats,
        seatPricing: showtime.seatPricing,
        createdAt: showtime.createdAt,
        updatedAt: showtime.updatedAt,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // [GET] /api/showtimes/filter-by-cinema-date?cinemaId=xxx&releaseDate=yyyy-mm-dd
  async filterByCinemaAndReleaseDate(req, res) {
    const { cinemaId, releaseDate, idMovie } = req.query;

    if (!cinemaId || !releaseDate) {
      return res.status(400).json({ msg: "Thiếu cinemaId hoặc releaseDate" });
    }

    try {
      const inputDate = new Date(releaseDate.replace(/\//g, "-"));
      const startOfDay = new Date(inputDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(inputDate);
      endOfDay.setHours(23, 59, 59, 999);

      // ✅ 1. Tìm showtimes của rạp (không lọc theo idMovie ở đây)
      let showtimes = await ShowTime.find({ cinemaId })
        .populate("movieId")
        .populate("roomId", "name")
        .populate("cinemaId", "name location");

      // ✅ 2. Nếu có idMovie thì chỉ giữ showtimes của phim đó
      if (idMovie) {
        showtimes = showtimes.filter((showtime) => showtime.movieId?._id?.toString() === idMovie);
      }

      // ✅ 3. Lọc suất chiếu theo ngày nhập và ngày chiếu nằm trong movieScreenings
      const filtered = showtimes.filter((showtime) => {
        const movie = showtime.movieId;
        if (!movie || !Array.isArray(movie.movieScreenings)) return false;

        const isInScreening = movie.movieScreenings.some((screeningDate) => {
          const formatted = new Date(screeningDate).toISOString().slice(0, 10);
          return formatted === inputDate.toISOString().slice(0, 10);
        });

        const isInSameDay =
          new Date(showtime.startTime) >= startOfDay && new Date(showtime.startTime) <= endOfDay;

        return isInScreening && isInSameDay;
      });

      if (!filtered.length) {
        return res.status(404).json({ msg: "Không tìm thấy suất chiếu theo rạp và ngày chọn" });
      }
      filtered.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
      const grouped = {};
      filtered.forEach((showtime) => {
        const movieId = showtime.movieId._id.toString();
        if (!grouped[movieId]) {
          grouped[movieId] = {
            _id: movieId,
            movie: showtime.movieId,
            showtimes: [],
          };
        }

        grouped[movieId].showtimes.push({
          room: showtime.roomId,
          startTime: showtime.startTime,
          endTime: showtime.endTime,
          price: showtime.price,
          availableSeats: showtime.availableSeats,
          seatPricing: showtime.seatPricing,
          _id: showtime._id,
        });
      });

      const cinema = filtered[0]?.cinemaId || null;
      const data = Object.values(grouped);

      res.json({ cinema, data });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }

  // [GET] /api/showtimes/filter?roomId=xxx&movieId=yyy
  async getShowTimeByRoomAndMovie(req, res) {
    const { roomId, movieId } = req.query;

    if (!roomId || !movieId) {
      return res.status(400).json({ msg: "Thiếu roomId hoặc movieId" });
    }

    try {
      const showtimes = await ShowTime.find({ roomId, movieId })
        .populate("movieId", "title")
        .populate("roomId", "name")
        .populate("cinemaId", "name");

      if (!showtimes.length) {
        return res.status(404).json({ msg: "Không tìm thấy suất chiếu cho phòng và phim này" });
      }

      const formattedShowtimes = showtimes.map((showtime) => ({
        _id: showtime._id,
        movie: showtime.movieId,
        room: showtime.roomId,
        cinema: showtime.cinemaId,
        startTime: showtime.startTime,
        endTime: showtime.endTime,
        price: showtime.price,
        availableSeats: showtime.availableSeats,
        seatPricing: showtime.seatPricing,
        createdAt: showtime.createdAt,
        updatedAt: showtime.updatedAt,
      }));

      res.json(formattedShowtimes);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // [GET] /api/showtimes/room/:roomId
  async getShowTimeByRoomId(req, res) {
    const { roomId } = req.params;
    try {
      const showtimes = await ShowTime.find({ roomId })
        .populate("movieId", "title")
        .populate("roomId", "name")
        .populate("cinemaId", "name");

      if (!showtimes.length) {
        return res.status(404).json({ msg: "Không tìm thấy suất chiếu cho phòng này" });
      }

      const formattedShowtimes = showtimes.map((showtime) => ({
        _id: showtime._id,
        movie: showtime.movieId,
        room: showtime.roomId,
        cinema: showtime.cinemaId,
        startTime: showtime.startTime,
        endTime: showtime.endTime,
        price: showtime.price,
        availableSeats: showtime.availableSeats,
        createdAt: showtime.createdAt,
        updatedAt: showtime.updatedAt,
      }));

      res.json(formattedShowtimes);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  // [GET] /api/showtime/group-by-location?movieId=xxx&location=yyy
  async getCinemasByMovieID(req, res) {
    const { movieId, location } = req.query;

    if (!movieId) {
      return res.status(400).json({ msg: "Thiếu movieId" });
    }

    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({ msg: "movieId không hợp lệ" });
    }

    try {
      const pipeline = [
        { $match: { movieId: new mongoose.Types.ObjectId(movieId) } },
        {
          $lookup: {
            from: "cinemas",
            localField: "cinemaId",
            foreignField: "_id",
            as: "cinema",
          },
        },
        { $unwind: "$cinema" },
      ];

      // Thêm bước lọc theo location nếu có truyền param location
      if (location) {
        pipeline.push({
          $match: { "cinema.location": location },
        });
      }

      pipeline.push(
        {
          $group: {
            _id: "$cinema._id",
            name: { $first: "$cinema.name" },
            location: { $first: "$cinema.location" },
            image: { $first: "$cinema.image" },
            phone: { $first: "$cinema.phone" },
            cinemaCode: { $first: "$cinema.cinemaCode" },
            createdAt: { $first: "$cinema.createdAt" },
            updatedAt: { $first: "$cinema.updatedAt" },
            __v: { $first: "$cinema.__v" },
            countShowtimes: { $sum: 1 },
            rooms: { $first: "$cinema.rooms" },
          },
        },
        { $sort: { name: 1 } }
      );

      const cinemasRaw = await ShowTime.aggregate(pipeline);

      if (cinemasRaw.length === 0) {
        return res.status(404).json({ msg: "Không tìm thấy rạp nào có suất chiếu phim này" });
      }

      const cinemasGrouped = cinemasRaw.reduce((acc, cinema) => {
        const foundIndex = acc.findIndex((c) => c.cinemaCode === cinema.cinemaCode);
        const itemDetail = {
          _id: cinema._id,
          name: cinema.name,
          location: cinema.location,
          phone: cinema.phone,
          rooms: cinema.rooms || [],
          createdAt: cinema.createdAt,
          updatedAt: cinema.updatedAt,
          __v: cinema.__v,
          cinemaCode: cinema.cinemaCode,
          image: cinema.image,
        };

        if (foundIndex === -1) {
          acc.push({
            cinemaCode: cinema.cinemaCode,
            count: cinema.countShowtimes,
            name: cinema.name,
            image: cinema.image,
            items: [itemDetail],
          });
        } else {
          acc[foundIndex].count += cinema.countShowtimes;
          acc[foundIndex].items.push(itemDetail);
        }

        return acc;
      }, []);

      const address = cinemasRaw[0]?.location || "Chưa có địa chỉ";

      const result = [
        {
          total: cinemasRaw.length,
          address,
          cinemas: cinemasGrouped,
        },
      ];

      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  // [POST] api/showtimes
  async post(req, res) {
    const { movieId, roomId, cinemaId, startTime, price, seatPricing } = req.body;

    if (!movieId || !cinemaId || !roomId || !startTime || !price) {
      return res.status(400).json({ msg: "Please enter all required fields" });
    }

    try {
      const movie = await Movie.findById(movieId);
      if (!movie) return res.status(404).json({ msg: "Movie not found" });

      const room = await Room.findById(roomId);
      if (!room) return res.status(404).json({ msg: "Room not found" });

      const availableSeats = room.seats.filter((seat) => seat.isBooked === false).length;

      const durationMinutes = movie.duration;
      const start = new Date(startTime);
      const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

      const isOverlapping = await ShowTime.findOne({
        roomId,
        $or: [{ startTime: { $lt: end }, endTime: { $gt: start } }],
      });

      if (isOverlapping) {
        return res.status(400).json({ msg: "ShowTime overlaps with another existing showtime" });
      }

      const newShowTime = new ShowTime({
        movieId,
        roomId,
        cinemaId,
        startTime: start,
        endTime: end,
        price,
        availableSeats,
        seatPricing,
      });

      await newShowTime.save();

      res.json({ success: true, message: "ShowTime Created Successfully", showTime: newShowTime });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  // [PUT] api/showtimes/:id
  async put(req, res) {
    const { id } = req.params;
    const { movieId, roomId, cinemaId, startTime, price, seatPricing } = req.body;

    if (!movieId || !cinemaId || !roomId || !startTime || !price) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    try {
      const movie = await Movie.findById(movieId);
      if (!movie) return res.status(404).json({ msg: "Movie not found" });

      const room = await Room.findById(roomId);
      if (!room) return res.status(404).json({ msg: "Room not found" });

      const durationMinutes = movie.duration;
      const start = new Date(startTime);
      const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

      // Kiểm tra trùng lịch, loại trừ chính showtime đang update
      const isOverlapping = await ShowTime.findOne({
        _id: { $ne: id },
        roomId,
        $or: [{ startTime: { $lt: end }, endTime: { $gt: start } }],
      });

      if (isOverlapping) {
        return res.status(400).json({ msg: "ShowTime overlaps with another existing showtime" });
      }

      const availableSeats = room.seats.filter((seat) => seat.isBooked === false).length;

      const updatedShowTime = await ShowTime.findOneAndUpdate(
        { _id: id },
        {
          movieId,
          roomId,
          cinemaId,
          startTime: start,
          endTime: end,
          price,
          availableSeats,
          seatPricing,
        },
        { new: true }
      );

      if (!updatedShowTime) {
        return res.status(404).json({ success: false, message: "ShowTime not found" });
      }

      res.json({
        success: true,
        message: "ShowTime Updated Successfully",
        showTime: updatedShowTime,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // [PUT] /api/showtimes/update-same-time

  async updateShowTimesSameTime(req, res) {
    const { ids, startTime } = req.body;

    // Kiểm tra đầu vào
    if (
      !Array.isArray(ids) ||
      !ids.every((id) => mongoose.Types.ObjectId.isValid(id)) ||
      !startTime ||
      isNaN(new Date(startTime))
    ) {
      return res.status(400).json({ msg: "Dữ liệu không hợp lệ" });
    }

    try {
      const showtimes = await ShowTime.find({ _id: { $in: ids } }).populate("movieId");

      if (!showtimes.length) {
        return res.status(404).json({ msg: "Không tìm thấy suất chiếu nào để cập nhật" });
      }

      const start = new Date(startTime);

      // Tính lại từng endTime theo duration của movie
      const bulkUpdates = showtimes.map((showtime) => {
        const movie = showtime.movieId;
        const duration = movie?.duration || 0;
        const end = new Date(start.getTime() + duration * 60 * 1000);

        return {
          updateOne: {
            filter: { _id: showtime._id },
            update: {
              $set: {
                startTime: start,
                endTime: end,
              },
            },
          },
        };
      });

      const result = await ShowTime.bulkWrite(bulkUpdates);

      res.json({ msg: "Cập nhật thành công", result });
    } catch (err) {
      res.status(500).json({ msg: "Lỗi server", error: err.message });
    }
  }
  // [PATCH] /api/showtimes/:id/available-seats
  async updateAvailableSeats(req, res) {
    const { id } = req.params;
    const { totalSeats, bookedSeats } = req.body;

    // Validate input
    if (typeof totalSeats !== "number" || typeof bookedSeats !== "number") {
      return res.status(400).json({ msg: "totalSeats and bookedSeats must be numbers" });
    }

    const availableSeats = totalSeats - bookedSeats;

    if (availableSeats < 0) {
      return res.status(400).json({ msg: "Booked seats cannot be greater than total seats" });
    }

    try {
      const updatedShowTime = await ShowTime.findByIdAndUpdate(
        id,
        { availableSeats },
        { new: true }
      );

      if (!updatedShowTime) {
        return res.status(404).json({ success: false, message: "ShowTime not found" });
      }

      res.json({
        success: true,
        message: "Available seats updated successfully",
        showTime: updatedShowTime,
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
