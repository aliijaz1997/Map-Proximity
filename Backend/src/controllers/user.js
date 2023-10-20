const User = require("../models/user");
const generateHash = require("../utils/getHashPassword");
const auth = require("../config/firebase-config");

exports.createUser = async (req, res, next) => {
  try {
    const { password, addedBy, id, ...body } = req.body;
    const hashPassword = await generateHash(password);
    if (addedBy) {
      const authUser = await auth.createUser({
        email: body.email,
        password,
      });

      const user = new User({
        ...body,
        password: hashPassword,
        _id: authUser.uid,
      });

      await user.save();
      return res.status(201).json(user);
    }

    const user = new User({
      ...body,
      password: hashPassword,
      _id: id,
    });
    await user.save();
    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: req.params.role });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.updateUserById = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.deleteUserById = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

exports.userStats = async (_req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalDrivers = await User.countDocuments({ role: "driver" });
    const totalCustomers = await User.countDocuments({ role: "customer" });

    const monthlyData = await User.aggregate([
      {
        $match: {
          createdAt: { $exists: true },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    res.json({
      totalUsers,
      totalAdmins,
      totalDrivers,
      totalCustomers,
      monthlyData,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
