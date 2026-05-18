import express from "express";
import {
  bookEvent,
  cancelBooking,
  getMyBookings,
  scanQR
} from "../controllers/bookingController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router(); // 🔥 MUST BE FIRST

// ================= ROUTES =================

router.post("/book", authMiddleware, bookEvent);

router.get("/my", authMiddleware, getMyBookings);

router.post("/cancel/:id", authMiddleware, cancelBooking);

// QR scan (organizer)
router.post("/scan", scanQR);

export default router;