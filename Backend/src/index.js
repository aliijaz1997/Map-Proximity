const express = require("express");
const app = express();

const cors = require("cors");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const connectDB = require("./utils/db");
connectDB();

const userRoute = require("./routes/userRoute");
const VerifyToken = require("./middlewares/verifyToken");

app.use("/api/users", VerifyToken, userRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
