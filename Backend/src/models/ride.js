const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  status: {
    type: String,
    enum: ["accepted", "started", "completed"],
    required: true,
  },
  customerAddress: {
    lat: { type: Number },
    lng: { type: Number },
    address: { type: String },
  },
  customer: {
    _id: { type: String, required: true },
    name: { type: String, required: true },
  },
  driver: {
    _id: { type: String, required: true },
    name: { type: String, required: true },
  },
  driverAddress: {
    lat: { type: Number },
    lng: { type: Number },
    address: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Ride", rideSchema);
