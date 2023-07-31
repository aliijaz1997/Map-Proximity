const express = require("express");
const router = express.Router();
const rideController = require("../controllers/ride");

// Update a ride by ID
router.put("/:id", rideController.createOrUpdateRideById);

module.exports = router;
