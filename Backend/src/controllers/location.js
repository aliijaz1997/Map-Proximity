const Location = require("../models/location");

exports.getLocation = async (_req, res, next) => {
  try {
    const locations = await Location.find();

    res.json(locations);
  } catch (error) {
    next(error);
  }
};

exports.updateLocation = async (req, res, next) => {
  try {
    const newLocation = new Location({
      path: req.body,
    });

    await newLocation.save();

    res.json("Location Updated successfully");
  } catch (error) {
    next(error);
  }
};

exports.deleteLocation = async (req, res, next) => {
  try {
    await Location.deleteMany();
    res.json("All locations successfully deleted!");
  } catch (error) {
    next(error);
  }
};
