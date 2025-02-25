const express = require("express");
const router = express.Router();

const paymentController = require("../app/controller/PaymentController");

//[GET] /api/payments
router.get("/", paymentController.index);
//[DELETE] /api/payments/:id
router.delete("/:id", paymentController.delete);
// [PUT] /api/payments/:id
router.put("/:id", paymentController.put);
// [POST] /api/payments
router.post("/", paymentController.post);
module.exports = router;
