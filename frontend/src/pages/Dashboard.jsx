import { useEffect, useState } from "react";
import { EventAPI } from "../services/api"; // ✅ FIXED
import Navbar from "../components/Navbar";
import EventCard from "../components/EventCard";

export default function Dashboard() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await EventAPI.get("/event/all"); // ✅ FIXED
        setEvents(res.data.data);
      } catch (err) {
        console.error("Error fetching events", err);
      }
    };

    fetchEvents();
  }, []);

  // return (
  //   <div>
  //     <Navbar />

  //     <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  //       {events.length > 0 ? (
  //         events.map((e) => (
  //           <EventCard key={e._id} event={e} />
  //         ))
  //       ) : (
  //         <p className="text-center col-span-full text-gray-500">
  //           No events found
  //         </p>
  //       )}
  //     </div>
  //   </div>
  // );
  return (
  <div className="min-h-screen bg-gray-100">
    <Navbar />

    {/* 🔥 CONTAINER */}
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* 🔥 GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">

        {events.length > 0 ? (
          events.map((e) => (
            <EventCard key={e._id} event={e} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No events found
          </p>
        )}

      </div>
    </div>
  </div>
);
}