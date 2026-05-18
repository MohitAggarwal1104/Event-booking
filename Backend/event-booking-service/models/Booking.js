import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event"
  },
  userId: String,
  userEmail: String,
  seats: Number,

  paymentStatus: {
    type: String,
    default: "pending"
  },
  status: {
  type: String,
  enum: ["active", "used"],
  default: "active"
},
  qrCode: String
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);