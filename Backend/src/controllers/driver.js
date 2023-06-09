const Driver = require("../models/driver");

exports.createDriver = async (req, res, next) => {
  try {
    const driver = await Driver.create(req.body);
    res.status(201).json(driver);
  } catch (error) {
    next(error);
  }
};

exports.getDrivers = async (req, res, next) => {
  try {
    const drivers = await Driver.find();
    res.json(drivers);
  } catch (error) {
    next(error);
  }
};

exports.getDriverById = async (req, res, next) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }
    res.json(driver);
  } catch (error) {
    next(error);
  }
};

exports.updateDriverById = async (req, res, next) => {
  try {
    const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }
    res.json(driver);
  } catch (error) {
    next(error);
  }
};

exports.deleteDriverById = async (req, res, next) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
