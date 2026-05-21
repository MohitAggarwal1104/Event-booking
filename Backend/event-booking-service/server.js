import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

import eventRoutes from "./routes/eventRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const app = express();

// ================= DATABASE =================

connectDB();

// ================= MIDDLEWARE =================

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://event-booking-indol-ten.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());

// ================= ROUTES =================

app.use("/api/event", eventRoutes);

app.use("/api/booking", bookingRoutes);

app.use("/api/payment", paymentRoutes);

// ================= TEST ROUTE =================

app.get("/", (req, res) => {
  res.send("Event Service Running 🚀");
});

// ================= START SERVER =================

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
