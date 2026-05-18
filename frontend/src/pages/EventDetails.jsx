import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState({});
  const [seats, setSeats] = useState(1);

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    const res = await API.get(`/event/${id}`);
    setEvent(res.data.data);
  };

  const handleBooking = async () => {
    await API.post("/booking/book", {
      eventId: id,
      seats
    });

    alert("Booked!");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">{event.title}</h2>

      <p>{event.location}</p>
      <p>Available: {event.availableSeats}</p>

      <input
        type="number"
        value={seats}
        onChange={(e) => setSeats(e.target.value)}
      />

      <button className="btn mt-3" onClick={handleBooking}>
        Book
      </button>
    </div>
  );
}