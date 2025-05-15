const Payment = require("../models/Payment");
const { VNPay, ignoreLogger, dateFormat, ProductCode, VnpLocale } = require("vnpay");
const moment = require("moment");

class PaymentController {
  async vnpayPayment(req, res) {
    const showtimeId = req.body.idShowTime;
    try {
      const vnpay = new VNPay({
        tmnCode: "V372L6LI",
        secureSecret: "KD2EDN0J82SN5UUQGV90IPT8XEQXQ9TJ",
        vnpayHost: "https://sandbox.vnpayment.vn",
        testMode: true,
        hashAlgorithm: "SHA512",
        enableLog: true,
        loggerFn: ignoreLogger,
      });

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const paymentUrl = await vnpay.buildPaymentUrl({
        vnp_Amount: 50000,
        vnp_IpAddr: "127.0.0.1",
        vnp_TxnRef: "1234511asasssqq222422",
        vnp_OrderInfo: "123456",
        vnp_OrderType: ProductCode.Other,
        vnp_ReturnUrl: `http://localhost:3000/pages/book-ticket/${showtimeId}`,
        vnp_Locale: VnpLocale.VN,
        vnp_CreateDate: dateFormat(new Date()),
        vnp_ExpireDate: dateFormat(tomorrow),
      });

      return res.status(201).json({ success: true, paymentUrl });
    } catch (error) {
      console.error("VNPay error:", error);
      return res.status(500).json({ success: false, error: "Lỗi khi tạo thanh toán VNPay" });
    }
  }
}

module.exports = new PaymentController();
