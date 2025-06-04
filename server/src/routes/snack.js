const express = require("express");
const SnackController = require("../app/controller/SnackController");
const router = express.Router();

// Route để lấy tất cả snack
router.get("/getAll", SnackController.getAllSnacks);

//[GET] /api/snacks?page=1&limit=10
router.get("/", SnackController.getSnacksByPageAndLimit);

// Tạo snack mới cho rạp
router.post("/", SnackController.createSnack);

// Lấy danh sách snack theo rạp
router.get("/:cinemaId", SnackController.getSnacksByCinema);

// Cập nhật snack
router.put("/:id", SnackController.updateSnack);

// Xóa snack
router.delete("/:id", SnackController.deleteSnack);

module.exports = router;
