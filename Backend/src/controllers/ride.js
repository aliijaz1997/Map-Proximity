const Ride = require("../models/ride");

exports.getAllRides = async (_req, res, next) => {
  try {
    const rides = await Ride.find();

    res.json(rides);
  } catch (error) {
    next(error);
  }
};

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
