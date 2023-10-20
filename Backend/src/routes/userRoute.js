const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

router.post("/", userController.createUser);

router.get("/stats", userController.userStats);

router.get("/all/:role", userController.getUsers);

router.get("/:id", userController.getUserById);

router.put("/:id", userController.updateUserById);

router.delete("/:id", userController.deleteUserById);

module.exports = router;
