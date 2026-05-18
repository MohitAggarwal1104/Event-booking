import dotenv from "dotenv";
dotenv.config(); // 🔥 MUST BE FIRST
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import eventRoutes from "./routes/eventRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const app = express(); // 🔥 create app FIRST
app.use(express.json());
// middleware
app.use(cors());
app.use(express.json());

// DB
connectDB();

// routes
app.use("/api/event", eventRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/payment", paymentRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Event Service Running 🚀");
});

// start server
app.listen(5001, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});