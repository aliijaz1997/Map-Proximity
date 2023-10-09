const stripe = require("stripe")(
  "sk_test_51JbjUUEHe38urH12QnhBcl7jIOXGrpIF5bvzT42rEIDeD8cqLIFAqPeGotmWqjmUuw1m2GUF27diD34mFNQPyUYv003D0eGqcu"
);
const User = require("../models/user");
const Payment = require("../models/payment");

exports.addCard = async (req, res, next) => {
  try {
    const { token, email, id } = req.body;
    console.log(token, email);
    if (token && email) {
      // Create a PaymentMethod from the token
      const paymentMethod = await stripe.paymentMethods.create({
        type: "card",
        card: {
          token: token,
        },
      });

      // Create a customer and attach the PaymentMethod
      const customer = await stripe.customers.create({
        email,
        description: "Customer of Ride app",
        payment_method: paymentMethod.id,
      });
      if (customer) {
        await User.findByIdAndUpdate(
          id,
          { customerPaymentId: customer.id },
          {
            new: true,
          }
        );
      }
      return res.json({ customer, paymentMethod });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while saving the card", error });
  }
};

exports.checkSavedCard = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    if (customerId) {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: "card",
      });
      console.log(paymentMethods);
      if (paymentMethods) {
        return res.json(paymentMethods);
      } else {
        res.status(404).json({
          description: "No payment method is associated with this customerId",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "An error occurred while checking the card", error });
  }
};

exports.makePayment = async (req, res, next) => {
  try {
    const { customerId, amount } = req.body;

    const amountInCents = Math.round(amount * 100);
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: "card",
    });
    if (paymentMethods.data.length > 0) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: "usd",
        customer: customerId,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: "never",
        },
        payment_method: paymentMethods.data[0].id,
      });

      await stripe.paymentIntents.confirm(paymentIntent.id);

      res.json({ message: "Payment successful" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the payment" });
  }
};

exports.createPayment = async (req, res) => {
  const { status, driver, customer, amount, location } = req.body;

  try {
    // Create a new payment document
    const newPayment = new Payment({
      status,
      driver,
      customer,
      amount,
      location,
    });

    // Save the payment document to the database
    const savedPayment = await newPayment.save();

    res.status(201).json(savedPayment);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.findAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.findCustomerPayments = async (req, res) => {
  const customerId = req.params.customerId;

  try {
    // Adjust the query to match the new schema
    const payments = await Payment.find({ "customer._id": customerId });
    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  const paymentId = req.params.paymentId;
  const { status } = req.body;

  try {
    const updatedPayment = await Payment.findByIdAndUpdate(
      paymentId,
      { status },
      { new: true }
    );

    if (!updatedPayment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res.status(200).json(updatedPayment);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.adminTotalEarnings = async (req, res) => {
  try {
    const successfulPayments = await Payment.find({ status: "success" });

    let adminEarnings = 0;
    successfulPayments.forEach((payment) => {
      const amount = parseFloat(payment.amount);

      const adminShare = amount * 0.2;
      adminEarnings += adminShare;
    });

    res.json(adminEarnings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.driverTotalEarnings = async (req, res) => {
  try {
    const { id } = req.params;

    const successfulPayments = await Payment.find({
      "driver._id": id,
      status: "success",
    });

    let driverEarnings = 0;
    successfulPayments.forEach((payment) => {
      const amount = parseFloat(payment.amount);

      const driverShare = amount * 0.8;
      driverEarnings += driverShare;
    });

    res.json(driverEarnings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
