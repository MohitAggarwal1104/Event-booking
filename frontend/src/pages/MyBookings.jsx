import { useEffect, useState } from "react";
import { EventAPI } from "../services/api";
import Navbar from "../components/Navbar";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await EventAPI.get("/booking/my");
        setBookings(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div>
      <Navbar />

      <div className="p-6">
        <h2 className="text-2xl mb-4">My Bookings</h2>

        {bookings.map((b) => (
          <div key={b._id} className="border p-4 mb-3 rounded">
            <p>Event: {b.eventId?.title}</p>
            <p>Seats: {b.seats}</p>
            <p>Status: {b.paymentStatus}</p>
          </div>
        ))}
      </div>
    </div>
  );
}