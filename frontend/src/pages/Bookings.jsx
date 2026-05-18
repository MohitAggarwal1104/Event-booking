// import { useEffect, useState } from "react";
// import { EventAPI } from "../services/api";
// import Navbar from "../components/Navbar";

// export default function Bookings() {
//   const [bookings, setBookings] = useState([]);

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const res = await EventAPI.get("/booking/my");

//         console.log("📦 BOOKINGS:", res.data);

//         setBookings(res.data.data);
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     fetchBookings();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Navbar />

//       <div className="p-6">
//         <h2 className="text-2xl font-bold mb-6">My Bookings</h2>

//         {bookings.map((b) => (
//           <div key={b._id} className="bg-white p-4 rounded shadow mb-4">

//             <p><b>Event:</b> {b.eventId?.title}</p>
//             <p><b>Seats:</b> {b.seats}</p>
//             <p><b>Status:</b> {b.paymentStatus}</p>

//             {/* 🔥 QR CODE */}
//             {b.qrCode && (
//               <div className="mt-4">
//                 <p className="font-semibold mb-2">Your Ticket QR:</p>
//                 <img
//                   src={b.qrCode}
//                   alt="QR Code"
//                   className="w-40 h-40 border"
//                 />
//               </div>
//             )}

//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { EventAPI } from "../services/api";
import Navbar from "../components/Navbar";

const DEFAULT_POSTER =
  "https://images.unsplash.com/photo-1497032205916-ac775f0649ae?q=80&w=800";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await EventAPI.get("/booking/my");
        setBookings(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-6">
          My Bookings 🎟
        </h2>

        <div className="space-y-5">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition flex overflow-hidden"
            >
              {/* 🎬 POSTER */}
              <img
                src={b.eventId?.poster || DEFAULT_POSTER}
                alt="poster"
                className="w-[140px] h-[140px] object-cover"
              />

              {/* 📄 DETAILS */}
              <div className="flex-1 p-4">
                <h3 className="text-lg font-semibold">
                  {b.eventId?.title}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  📍 {b.eventId?.location}
                </p>

                <div className="mt-2 text-sm text-gray-700">
                  <p>
                    Seats:{" "}
                    <span className="font-semibold">
                      {b.seats}
                    </span>
                  </p>

                  <p>
                    Status:{" "}
                    <span className="text-green-600 font-semibold">
                      {b.paymentStatus}
                    </span>
                  </p>
                </div>
              </div>

              {/* 🔳 QR */}
              {b.qrCode && (
                <div className="flex flex-col items-center justify-center p-4 border-l">
                  <p className="text-xs text-gray-500 mb-2">
                    Scan at Entry
                  </p>

                  <img
                    src={b.qrCode}
                    alt="QR"
                    className="w-24 h-24 border rounded"
                  />
                </div>
              )}
            </div>
          ))}

          {bookings.length === 0 && (
            <p className="text-center text-gray-500">
              No bookings found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}