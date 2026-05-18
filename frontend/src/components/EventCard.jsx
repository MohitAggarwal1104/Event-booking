import { useState } from "react";
import { EventAPI } from "../services/api";
const token = localStorage.getItem("token");
const userId = token ? JSON.parse(atob(token.split(".")[1])).id : null;
// 🎬 Default fallback poster
const DEFAULT_POSTER =
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800";

export default function EventCard({ event }) {
  const [loading, setLoading] = useState(false);
  const [imgSrc, setImgSrc] = useState(event.poster || DEFAULT_POSTER);

  const bookEvent = async () => {
    try {
      if (!event?._id) {
        alert("Invalid event");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first");
        return;
      }

      setLoading(true);

      console.log("🚀 Booking event:", event._id);

      // ================= CREATE BOOKING =================
      const bookingRes = await EventAPI.post("/booking/book", {
        eventId: event._id,
        seats: 1
      });

      console.log("✅ Booking created:", bookingRes.data);

      const bookingId = bookingRes.data.data._id;

      // ================= FREE EVENT =================
      if (!event.price || event.price === 0) {
        alert("Booking confirmed 🎉");
        window.location.href = "/bookings";
        return;
      }

      // ================= CREATE ORDER =================
      const orderRes = await EventAPI.post("/payment/create-order", {
        amount: event.price
      });

      const order = orderRes.data.data;

      console.log("💳 Order:", order);

      // ================= RAZORPAY =================
      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded");
        return;
      }

      const options = {
        key: "rzp_test_Sk0ByWdjNOfuPN",
        amount: order.amount,
        currency: "INR",
        order_id: order.id,

        name: "Event Booking",
        description: event.title,

        handler: async function (response) {
          try {
            console.log("💰 Razorpay Response:", response);

            const verifyRes = await EventAPI.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId
            });

            console.log("✅ VERIFY SUCCESS:", verifyRes.data);

            alert("Booking successful 🎉");
            window.location.href = "/bookings";

          } catch (err) {
            console.log("❌ VERIFY ERROR:", err.response?.data);
            alert("Payment verification failed");
          } finally {
            setLoading(false);
          }
        },

        modal: {
          ondismiss: function () {
            alert("Payment cancelled");
            setLoading(false);
          }
        },

        prefill: {
          name: "User",
          email: "test@example.com"
        },

        theme: {
          color: "#E50914" // Netflix/BookMyShow vibe 🔥
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.log("❌ Booking Error:", err.response?.data);

      alert(
        err.response?.data?.message ||
        "Booking failed. Check console."
      );

      setLoading(false);
    }
  };

  return (
    <div className="w-72 bg-black rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition duration-300">

      {/* 🎬 POSTER */}
      <div className="relative">
        <img
          src={imgSrc}
          alt="poster"
          className="w-full h-80 object-cover"
          onError={() => setImgSrc(DEFAULT_POSTER)}
        />

        {/* 👍 LIKES BAR */}
        <div className="absolute bottom-0 w-full bg-black bg-opacity-80 px-3 py-2 flex items-center gap-2">
          <span className="text-green-400 text-sm">👍</span>
          <span className="text-white text-sm">
            {event.likes || "0"} Likes
          </span>
        </div>
      </div>

      {/* 🎥 DETAILS */}
      <div className="p-4 bg-white text-black">
        <h3 className="text-lg font-bold">{event.title}</h3>

        <p className="text-gray-500 text-sm mt-1">
          {event.category || "Event"}
        </p>

        <p className="text-gray-600 text-sm mt-1">
          📍 {event.location}
        </p>

        <p className="mt-2 font-semibold">
          ₹ {event.price || 0}
        </p>

        {/* 🎟 BUTTON */}
        <button
          onClick={bookEvent}
          disabled={loading}
          className={`mt-3 w-full py-2 rounded-lg text-white font-semibold ${
            loading
              ? "bg-gray-400"
              : "bg-gradient-to-r from-red-500 to-pink-500 hover:scale-105"
          } transition`}
        >
          {loading ? "Processing..." : "Book Ticket"}
        </button>
      </div>
    </div>
  );
}