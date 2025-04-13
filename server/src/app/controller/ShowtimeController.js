const ShowTime = require("../models/Showtime");

class ShowTimeController {
  // [GET] /api/showtimes
  index(req, res) {
    ShowTime.find({})
      .populate("movieId", "title")
      .populate("roomId", "name")
      .populate("cinemaId", "name")
      .then((showtimes) => {
        console.log("Showtimes: ", showtimes);
        // Kiểm tra nếu movieId không được populate, hãy trả về thông báo lỗi
        if (!showtimes.length || !showtimes[0].movieId) {
          return res.status(400).json({ msg: "Không thể lấy dữ liệu movie" });
        }

        // Chỉ giữ lại movie trong response
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
      })
      .catch((error) => {
        res.status(400).json({ error: error.message });
      });
  }

  // [GET] /api/showtimes/filter-by-cinema-date?cinemaId=xxx&releaseDate=yyyy-mm-dd
  async filterByCinemaAndReleaseDate(req, res) {
    const { cinemaId, releaseDate } = req.query;

    if (!cinemaId || !releaseDate) {
      return res.status(400).json({ msg: "Thiếu cinemaId hoặc releaseDate" });
    }

    try {
      // 1. Chuẩn hóa inputDate: "2025/04/13" => "2025-04-13"
      const inputDate = new Date(releaseDate.replace(/\//g, "-"));
      const startOfDay = new Date(inputDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(inputDate);
      endOfDay.setHours(23, 59, 59, 999);

      // 2. Tìm showtimes của rạp
      const showtimes = await ShowTime.find({ cinemaId })
        .populate("movieId")
        .populate("roomId", "name")
        .populate("cinemaId", "name location");

      // 3. Lọc suất chiếu theo ngày nhập
      const filtered = showtimes.filter((showtime) => {
        const movie = showtime.movieId;
        if (!movie || !Array.isArray(movie.movieScreenings)) return false;

        // Kiểm tra ngày chiếu có trong movieScreenings
        const isInScreening = movie.movieScreenings.some((screeningDate) => {
          const formatted = new Date(screeningDate).toISOString().slice(0, 10);
          return formatted === inputDate.toISOString().slice(0, 10);
        });

        // Kiểm tra suất chiếu diễn ra trong ngày nhập
        const isInSameDay =
          new Date(showtime.startTime) >= startOfDay && new Date(showtime.startTime) <= endOfDay;

        return isInScreening && isInSameDay;
      });

      if (!filtered.length) {
        return res.status(404).json({ msg: "Không tìm thấy suất chiếu theo rạp và ngày chọn" });
      }

      // 4. Gom nhóm theo phim
      const grouped = {};
      filtered.forEach((showtime) => {
        const movieId = showtime.movieId._id.toString();
        if (!grouped[movieId]) {
          grouped[movieId] = {
            _id: movieId,
            movie: showtime.movieId,
            cinema: showtime.cinemaId,
            showtimes: [],
          };
        }

        grouped[movieId].showtimes.push({
          room: showtime.roomId,
          startTime: showtime.startTime,
          endTime: showtime.endTime,
          price: showtime.price,
          availableSeats: showtime.availableSeats,
          _id: showtime._id,
        });
      });

      const result = Object.values(grouped);
      res.json(result);
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

  // [POST] /api/showtimes
  async post(req, res) {
    const { movieId, roomId, cinemaId, startTime, endTime, price, availableSeats } = req.body;
    // Simple validation
    if (!movieId || !cinemaId || !roomId || !startTime || !endTime || !price || !availableSeats) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }
    try {
      // Kiểm tra trùng giờ trong cùng phòng
      const isOverlapping = await ShowTime.findOne({
        roomId,
        $or: [
          { startTime: { $lt: endTime }, endTime: { $gt: startTime } }, // Trùng khoảng thời gian
        ],
      });
      if (isOverlapping) {
        return res.status(400).json({ msg: "ShowTime overlaps with another existing showtime" });
      }
      const newShowTime = new ShowTime({
        movieId,
        roomId,
        cinemaId,
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
    const { movieId, roomId, cinemaId, startTime, endTime, price, availableSeats } = req.body;
    // Simple validation
    if (!movieId || !cinemaId || !roomId || !startTime || !endTime || !price || !availableSeats) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }
    try {
      let updateShowTime = {
        movieId,
        roomId,
        cinemaId,
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
