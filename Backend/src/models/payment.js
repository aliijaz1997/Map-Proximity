const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["pending", "success"],
    required: true,
  },
  customer: {
    _id: { type: String, required: true },
    name: { type: String, required: true },
  },
  location: { type: String, required: true },
  driver: {
    _id: { type: String, required: true },
    name: { type: String, required: true },
  },
  amount: { type: String, required: true },
});

module.exports = mongoose.model("Payment", paymentSchema);
