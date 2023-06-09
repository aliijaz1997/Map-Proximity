const express = require("express");
const app = express();

const cors = require("cors");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const connectDB = require("./utils/db");
connectDB();

const customerRoute = require("./routes/customerRoute");
const driverRoute = require("./routes/driverRoute");
const VerifyToken = require("./middlewares/verifyToken");

app.use("/api/customers", VerifyToken, customerRoute);
app.use("/api/drivers", VerifyToken, driverRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
