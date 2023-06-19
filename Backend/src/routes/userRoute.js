const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

// Create a new customer
router.post("/", userController.createUser);

// Get all customers
router.get("/all/:role", userController.getUsers);

// Get a single customer by ID
router.get("/:id", userController.getUserById);

// Update a customer by ID
router.put("/:id", userController.updateUserById);

// Delete a customer by ID
router.delete("/:id", userController.deleteUserById);

module.exports = router;
