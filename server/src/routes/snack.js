const express = require("express");
const SnackController = require("../app/controller/SnackController");
const router = express.Router();

// Route để lấy tất cả snack
router.get("/", SnackController.getAllSnacks);

// Tạo snack mới cho rạp
router.post("/", SnackController.createSnack);

// Lấy danh sách snack theo rạp
router.get("/:cinemaId", SnackController.getSnacksByCinema);

// Cập nhật snack
router.put("/:id", SnackController.updateSnack);

// Xóa snack
router.delete("/:id", SnackController.deleteSnack);

module.exports = router;
