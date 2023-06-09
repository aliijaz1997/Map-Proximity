const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  location: {
    lat: { type: Number },
    lng: { type: Number },
    address: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  status: {
    type: String,
    enum: ["active", "non active"],
    default: "active",
  },
  imageUrl: { type: String, required: true },
  carNumber: { type: String, required: true },
  carName: { type: String, required: true },
  carImage: { type: String, required: true },
});

module.exports = mongoose.model("Driver", driverSchema);
