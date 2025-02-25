const Payment = require("../models/Payment");

class PaymentController {
  //[GET] /api/payments
  async index(req, res) {
    Payment.find({})
      .populate("userId", "username")
      .populate("bookingId", "totalPrice")
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        res.status(400).json({ error: error.message });
      });
  }
  // [POST] /api/payments
  async post(req, res) {
    const { userId, bookingId, amount, paymentMethod, status } = req.body;
    // Simple validation
    if (!userId || !bookingId || !amount || !paymentMethod) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }
    try {
      const newPayment = new Payment({
        userId,
        bookingId,
        amount,
        paymentMethod,
        status,
      });
      await newPayment.save();
      // Create new payment successfully
      res.json({ success: true, message: "Payment created successfully", payment: newPayment });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  // [PUT] /api/payments/:id
  async put(req, res) {
    const { id } = req.params;
    const { userId, bookingId, amount, paymentMethod, status } = req.body;
    // Simple validation
    if (!userId || !bookingId || !amount || !paymentMethod) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }
    try {
      let updatePayment = {
        userId,
        bookingId,
        amount,
        paymentMethod,
        status,
      };
      const paymentUpdateCondition = { _id: id };

      updatePayment = await Payment.findOneAndUpdate(paymentUpdateCondition, updatePayment, {
        new: true,
      });
      // Update payment successfully
      res.json({ success: true, message: "Payment updated successfully", payment: updatePayment });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  // [DELETE] /api/payments/:id
  async delete(req, res) {
    const { id } = req.params;
    try {
      const paymentDeleteCondition = { _id: id };
      const deletePayment = await Payment.findOneAndDelete(paymentDeleteCondition);
      if (!deletePayment) {
        res.json({ success: false, message: "Payment not found" });
      }
      // Delete payment successfully
      res.json({ success: true, message: "Payment deleted successfully", payment: deletePayment });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new PaymentController();
