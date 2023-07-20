const mongoose = require("mongoose");

const polygonSchema = new mongoose.Schema({
  path: {
    type: [
      {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    ],
    required: true,
  },
});

const PolygonModel = mongoose.model("Polygon", polygonSchema);

module.exports = PolygonModel;
