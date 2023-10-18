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

exports.getUserRides = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const userType = req.params.userType;
    if (userType === "customer") {
      const rides = await Ride.find({ "customer._id": userId })
        .sort({ createdAt: -1 })
        .limit(15);
      res.json(rides);
    } else if (userType === "driver") {
      const rides = await Ride.find({ "driver._id": userId })
        .sort({ createdAt: -1 })
        .limit(15);
      res.json(rides);
    }
  } catch (error) {
    res.status(500).json(`Error occurred in getting ${userType} rides.`);
  }
};

exports.getPendingPaymentRide = async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const rides = await Ride.find({
      "customer._id": customerId,
      paymentStatus: "pending",
    })
      .sort({ createdAt: -1 })
      .limit(1);
    if (rides.length > 0) {
      return res.json(rides[0]);
    } else {
      res.json(undefined);
    }
  } catch (error) {
    res.status(500).json("Error occurred in getting latest ride.");
  }
};

exports.getCustomerStats = async (req, res) => {
  try {
    const customerId = req.params.customerId;

    // Calculate the average rides per month for the customer
    const rides = await Ride.find({ "customer._id": customerId });
    const monthlyRides = {};

    rides.forEach((ride) => {
      const rideDate = new Date(ride.createdAt);
      const month = rideDate.getMonth() + 1; // Month is 0-indexed, so add 1
      if (!monthlyRides[month]) {
        monthlyRides[month] = 0;
      }
      monthlyRides[month]++;
    });

    const amountsInNumbers = rides.map((ride) => parseFloat(ride.amount));

    const totalAmount = amountsInNumbers.reduce(
      (acc, amount) => acc + amount,
      0
    );
    const averageAmount = totalAmount / rides.length;
    const result = [];
    for (let month = 1; month <= 12; month++) {
      const ridesCount = monthlyRides[month] || 0;
      result.push({ month, ridesCount });
    }

    // Categorize the customer based on the criteria
    let customerCategory = "Basic";
    const totalRides = rides.length;

    if (totalRides >= 10 && totalRides < 20) {
      customerCategory = "Silver";
    } else if (totalRides >= 20) {
      customerCategory = "Gold";
    }

    const monthlyEarnings = await Ride.aggregate([
      { $match: { "customer._id": customerId, paymentStatus: "success" } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          monthlyEarnings: { $sum: { $toDouble: "$amount" } },
        },
      },
    ]);

    const spendingPerMonth = Array(12).fill(0);

    monthlyEarnings.forEach((item) => {
      const monthIndex = item._id - 1;
      spendingPerMonth[monthIndex] = item.monthlyEarnings;
    });

    res.json({
      customerCategory,
      monthlyRides: result,
      spendingPerMonth,
      averageAmount,
      totalAmount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getDriverStats = async (req, res) => {
  try {
    const driverId = req.params.driverId;

    const totalRides = await Ride.countDocuments({ "driver._id": driverId });

    const totalEarnings = await Ride.aggregate([
      { $match: { "driver._id": driverId, paymentStatus: "success" } },
      {
        $group: {
          _id: null,
          total: { $sum: { $toDouble: "$amount" } },
        },
      },
    ]);

    const pendingPayments = await Ride.countDocuments({
      "driver._id": driverId,
      paymentStatus: "pending",
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentDayRides = await Ride.countDocuments({
      createdAt: { $gte: today },
    });

    const monthlyEarnings = await Ride.aggregate([
      { $match: { "driver._id": driverId, paymentStatus: "success" } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          monthlyEarnings: { $sum: { $toDouble: "$amount" } },
          monthlyRides: { $sum: 1 },
        },
      },
    ]);

    const earningsPerMonth = Array(12).fill(0);
    const ridesPerMonth = Array(12).fill(0);

    monthlyEarnings.forEach((item) => {
      const monthIndex = item._id - 1;
      earningsPerMonth[monthIndex] = item.monthlyEarnings * 0.8;
      ridesPerMonth[monthIndex] = item.monthlyRides;
    });

    res.json({
      totalRides,
      totalEarnings: totalEarnings[0] ? totalEarnings[0].total : 0,
      pendingPayments,
      currentDayRides,
      earningsPerMonth,
      ridesPerMonth,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
