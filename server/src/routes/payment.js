const express = require("express");
const router = express.Router();

const paymentVnPayController = require("../app/controller/PaymentController");

// [POST] /api/payment/vn-pay
router.post("/vn-pay", paymentVnPayController.vnpayPayment);

module.exports = router;
