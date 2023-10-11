const express = require("express");
const router = express.Router();
const rideController = require("../controllers/ride");

router.get("/", rideController.getAllRides);
router.get("/pending/:customerId", rideController.getPendingPaymentRide);
router.get("/:userType/:userId", rideController.getUserRides);
router.get("/customer/:customerId/stats", rideController.getCustomerStats);
router.get("/driver/:driverId/stats", rideController.getDriverStats);
router.put("/:id", rideController.createOrUpdateRideById);

module.exports = router;
