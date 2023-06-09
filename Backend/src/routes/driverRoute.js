const express = require("express");
const router = express.Router();
const driverController = require("../controllers/driver");

// Create a new customer
router.post("/", driverController.createDriver);

// Get all customers
router.get("/", driverController.getDrivers);

// Get a single customer by ID
router.get("/:id", driverController.getDriverById);

// Update a customer by ID
router.put("/:id", driverController.updateDriverById);

// Delete a customer by ID
router.delete("/:id", driverController.deleteDriverById);

module.exports = router;
