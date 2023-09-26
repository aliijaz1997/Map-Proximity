const express = require("express");
const router = express.Router();
const eventsController = require("../controllers/events");

router.post("/", eventsController.triggerEvents);
router.post("/user-auth", eventsController.authenticateUser);
router.post("/channel-auth", eventsController.authorizeChannel);

module.exports = router;
