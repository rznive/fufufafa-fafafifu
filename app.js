require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const sequelize = require("./src/configs/db");
const {
  requestLogger,
  errorLogger,
  logger,
} = require("./src/middlewares/loggerHandler");
const auth = require("./src/routes/authRoute");
const room = require("./src/routes/roomRoute");
const booking = require("./src/routes/bookingRoute");
const payment = require("./src/routes/paymentRoute");
const bill = require("./src/routes/billRoute");
const complaint = require("./src/routes/complaintRoute");
const checkout = require("./src/routes/checkoutRoute");
const errorHandler = require("./src/middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
});

app.use(cors());
app.use(express.json());

app.use(limiter);
app.use(requestLogger);

app.use("/api/auth", auth);
app.use("/api/rooms", room);
app.use("/api/bookings", booking);
app.use("/api/payments", payment);
app.use("/api/bills", bill);
app.use("/api/complaints", complaint);
app.use("/api/checkout", checkout);

app.get("/", (req, res) => {
  logger.info("Root endpoint accessed");
  res.json({ success: true, message: "Backend API is running" });
});

app.use(errorLogger);
app.use(errorHandler);

sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
