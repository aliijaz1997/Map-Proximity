const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payments");

router.get("/", paymentController.adminTotalEarnings);
router.post("/", paymentController.createPayment);
router.get("/:customerId", paymentController.findCustomerPayments);
router.put("/:paymentId", paymentController.updatePaymentStatus);
router.get("/checkCard/:customerId", paymentController.checkSavedCard);
router.post("/addCard", paymentController.addCard);
router.post("/makePayment", paymentController.makePayment);
router.get("/driverEarnings/:id", paymentController.driverTotalEarnings);

module.exports = router;
