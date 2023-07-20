const express = require("express");
const router = express.Router();
const locationController = require("../controllers/location");

// Update a customer by ID
router.post("/", locationController.updateLocation);

// Get a single customer by ID
router.get("/", locationController.getLocation);

// Delete all location
router.delete("/", locationController.deleteLocation);

module.exports = router;
