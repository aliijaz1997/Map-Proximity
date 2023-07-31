const Ride = require("../models/ride");

exports.createOrUpdateRideById = async (req, res, next) => {
  try {
    const ride = await Ride.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!ride) {
      const newRide = new Ride(req.body);

      await newRide.save();

      res.json("Ride Created successfully");
    } else {
      res.json("Ride Updated successfully");
    }
  } catch (error) {
    next(error);
  }
};
