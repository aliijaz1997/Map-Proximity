const express = require("express");
const router = express.Router();
const rideController = require("../controllers/ride");

router.get("/", rideController.getAllRides);

// Update a ride by ID
router.put("/:id", rideController.createOrUpdateRideById);

module.exports = router;
