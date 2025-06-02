const express = require("express");
const TicketController = require("../app/controller/TicketController");
const router = express.Router();

// Route để lấy vé theo id user và status
router.get("/user/:userId", TicketController.getTicketByUser);

// Route để lấy vé theo id
router.get("/:id", TicketController.show);

// Route để lấy tất các vé
router.get("/", TicketController.index);

// Tạo vé mới
router.post("/", TicketController.post);

// Cập nhật vé
router.put("/:id", TicketController.put);

// Xóa vé
router.delete("/:id", TicketController.delete);

module.exports = router;
