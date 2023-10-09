const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  role: { type: String, enum: ["admin", "customer", "driver"], required: true },
  driverStatus: {
    type: String,
    enum: ["offline", "online", "engaged"],
    default: "online",
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
  phoneNumber: { type: String, unique: true },
  location: {
    lat: { type: Number },
    lng: { type: Number },
    address: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["active", "non active"],
    default: "active",
  },
  imageUrl: { type: String },
  carName: {
    type: String,
    enum: ["sedan", "hatchback", "pick up"],
    default: "hatchback",
  },
  carNumber: { type: String },
  carImage: { type: String },
  customerPaymentId: { type: String },
});

module.exports = mongoose.model("User", userSchema);
