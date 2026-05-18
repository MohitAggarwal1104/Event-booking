import crypto from "crypto";
import QRCode from "qrcode";

import Booking from "../models/Booking.js";
import Event from "../models/Event.js";

import { getRazorpayInstance } from "../services/paymentService.js";
import { sendTicketEmail } from "../services/emailService.js";


// ================= CREATE ORDER =================
export const createOrder = async (req, res) => {
  try {
    const razorpay = getRazorpayInstance();

    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({
        message: "Amount is required"
      });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100, // ₹ → paise
      currency: "INR"
    });

    res.json({
      data: order
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};


export const verifyPayment = async (req, res) => {
  try {
    console.log("🔍 VERIFY BODY:", req.body);

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        message: "Missing payment data"
      });
    }

    // 🔥 CORRECT SIGNATURE GENERATION
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    console.log("EXPECTED:", generatedSignature);
    console.log("RECEIVED:", razorpay_signature);

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        message: "Invalid signature"
      });
    }

    // 🔥 FIND BOOKING
    const booking = await Booking.findById(bookingId).populate("eventId");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    booking.paymentStatus = "completed";

    // 🔥 QR
    const qrData = JSON.stringify({ bookingId: booking._id });
    const qrImage = await QRCode.toDataURL(qrData);

    booking.qrCode = qrImage;
    await booking.save();

    // 🔥 SAFE EMAIL
    try {
      await sendTicketEmail(
        booking.userEmail,
        booking.eventId?.title || "Event",
        qrImage
      );
    } catch (e) {
      console.log("Email skipped");
    }

    return res.json({
      message: "Payment verified successfully",
      booking
    });

  } catch (err) {
    console.log("❌ VERIFY ERROR:", err);

    return res.status(500).json({
      message: err.message
    });
  }
};