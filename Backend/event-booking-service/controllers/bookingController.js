import Booking from "../models/Booking.js";
import Event from "../models/Event.js";
import { generateQR } from "../services/qrService.js";
import { sendEmail } from "../services/emailService.js";
// ================= BOOK EVENT =================
export const bookEvent = async (req, res) => {
  try {
    const { eventId, seats } = req.body;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // 🔥 check seats
    if (event.availableSeats < seats) {
      return res.status(400).json({
        message: "Not enough seats available"
      });
    }

    // 🔥 calculate price
    const totalAmount = event.isPaid
      ? event.price * seats
      : 0;

    // 🔥 reduce seats
    event.availableSeats -= seats;
    await event.save();

    // 🔥 create booking first
const booking = await Booking.create({
  userId: req.user.id,
  eventId,
  seatsBooked: seats,
  totalAmount,
  paymentStatus: event.isPaid ? "pending" : "completed"
});

// 🔥 generate QR
const qrData = JSON.stringify({
  bookingId: booking._id,
  eventId,
  userId: req.user.id
});

const qrCode = await generateQR(qrData);

// save QR
booking.qrCode = qrCode;
await booking.save();

// 🔥 send email (dummy email for now)
await sendEmail(
  "testuser@gmail.com", // later use real user email
  "Your Event Ticket 🎟️",
  `
    <h2>Booking Confirmed</h2>
    <p>Event: ${event.title}</p>
    <p>Seats: ${seats}</p>
    <p>Date: ${event.date}</p>
    <img src="${qrCode}" />
  `
);

    res.status(201).json({
      message: "Booking successful",
      data: booking
    });

  } catch (err) {
    res.status(500).json({
      message: "Error booking event"
    });
  }
};



// ================= CANCEL BOOKING =================
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    if (booking.bookingStatus === "cancelled") {
      return res.status(400).json({
        message: "Already cancelled"
      });
    }

    // 🔥 update event seats back
    const event = await Event.findById(booking.eventId);
    event.availableSeats += booking.seatsBooked;
    await event.save();

    // 🔥 refund 75%
    const refundAmount = booking.totalAmount * 0.75;

    booking.bookingStatus = "cancelled";
    await booking.save();

    res.json({
      message: "Booking cancelled",
      refund: refundAmount
    });

  } catch (err) {
    res.status(500).json({
      message: "Error cancelling booking"
    });
  }
};



// ================= GET MY BOOKINGS =================
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.user.id
    }).populate("eventId");

    res.json({
      data: bookings
    });

  } catch (err) {
    res.status(500).json({
      message: "Error fetching bookings"
    });
  }
};

export const scanQR = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId).populate("eventId");

    if (!booking) {
      return res.status(404).json({
        message: "Invalid ticket ❌"
      });
    }

    if (booking.bookingStatus !== "confirmed") {
      return res.status(400).json({
        message: "Ticket cancelled ❌"
      });
    }

    if (booking.isUsed) {
      return res.status(400).json({
        message: "Already used ⚠️"
      });
    }

    // 🔥 mark as used
    booking.isUsed = true;
    await booking.save();

    res.json({
      message: "Entry allowed ✅",
      data: {
        event: booking.eventId.title,
        seats: booking.seatsBooked
      }
    });

  } catch (err) {
    res.status(500).json({
      message: "Scan error"
    });
  }
};

// import Booking from "../models/Booking.js";

// export const verifyTicket = async (req, res) => {
//   try {
//     const { bookingId } = req.body;

//     const booking = await Booking.findById(bookingId);

//     if (!booking) {
//       return res.status(404).json({
//         message: "Invalid Ticket ❌"
//       });
//     }

//     if (booking.status === "used") {
//       return res.status(400).json({
//         message: "Ticket Already Used 🚫"
//       });
//     }

//     // ✅ mark used
//     booking.status = "used";
//     await booking.save();

//     res.json({
//       message: "Entry Allowed ✅",
//       data: booking
//     });

//   } catch (err) {
//     res.status(500).json({
//       message: err.message
//     });
//   }
// };

export const verifyTicket = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId)
      .populate("eventId");

    if (!booking) {
      return res.status(404).json({ message: "Invalid Ticket" });
    }

    const eventTime = new Date(booking.eventId.date);
    const now = new Date();

    const allowedTime = new Date(eventTime.getTime() - 5 * 60 * 1000);

    if (now < allowedTime) {
      return res.status(400).json({
        message: "Event not started yet ⏳"
      });
    }

    if (booking.status === "used") {
      return res.status(400).json({
        message: "Already used 🚫"
      });
    }

    booking.status = "used";
    await booking.save();

    res.json({
      message: "Entry Allowed ✅"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};