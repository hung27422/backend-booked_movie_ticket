const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const { VNPay, ignoreLogger, dateFormat, ProductCode, VnpLocale } = require("vnpay");
const moment = require("moment");

class PaymentController {
  async vnpayPayment(req, res) {
    const showtimeId = req.body.idShowTime;
    const bookingId = req.body.idBooking;
    try {
      const booking = await Booking.findById(bookingId);
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
        vnp_Amount: booking.totalPrice,
        vnp_IpAddr: "127.0.0.1",
        vnp_TxnRef: bookingId.toString(),
        vnp_OrderInfo: "Vé xem phim Bickie",
        vnp_OrderType: ProductCode.Other,
        vnp_ReturnUrl: `https://bickie.vercel.app/pages/book-ticket/${showtimeId}`,
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
