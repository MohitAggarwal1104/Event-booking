// import { useState } from "react";
// import { EventAPI } from "../services/api";
// import Navbar from "../components/Navbar";

// export default function CreateEvent() {
//   const [form, setForm] = useState({
//     title: "",
//     location: "",
//     price: "",
//     capacity: ""
//   });

//   const handleSubmit = async () => {
//     // ✅ validation
//     if (!form.title || !form.location || !form.price || !form.capacity) {
//       alert("All fields are required");
//       return;
//     }

//     const payload = {
//       title: form.title,
//       location: form.location,
//       price: Number(form.price),
//       capacity: Number(form.capacity)
//     };

//     console.log("🚀 PAYLOAD:", payload);

//     try {
//       const res = await EventAPI.post("/event/create", payload);

//       alert("Event Created Successfully");

//       // reset form
//       setForm({
//         title: "",
//         location: "",
//         price: "",
//         capacity: ""
//       });

//     } catch (err) {
//       console.log("❌ ERROR:", err.response?.data);
//       alert(err.response?.data?.message || "Error creating event");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Navbar />

//       <div className="flex justify-center items-center py-10">
//         <div className="bg-white w-[500px] p-8 rounded-2xl shadow-lg">

//           <h2 className="text-2xl font-bold mb-6 text-center">
//             Create Event
//           </h2>

//           <input
//             value={form.title}
//             className="w-full border p-3 mb-4 rounded-lg"
//             placeholder="Event Title"
//             onChange={(e) =>
//               setForm({ ...form, title: e.target.value })
//             }
//           />

//           <input
//             value={form.location}
//             className="w-full border p-3 mb-4 rounded-lg"
//             placeholder="Location"
//             onChange={(e) =>
//               setForm({ ...form, location: e.target.value })
//             }
//           />

//           <input
//             value={form.price}
//             type="number"
//             className="w-full border p-3 mb-4 rounded-lg"
//             placeholder="Price"
//             onChange={(e) =>
//               setForm({ ...form, price: e.target.value })
//             }
//           />

//           <input
//             value={form.capacity}
//             type="number"
//             className="w-full border p-3 mb-6 rounded-lg"
//             placeholder="Capacity"
//             onChange={(e) =>
//               setForm({ ...form, capacity: e.target.value })
//             }
//           />

//           <button
//             onClick={handleSubmit}
//             className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800"
//           >
//             Create Event
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import { EventAPI } from "../services/api";
import Navbar from "../components/Navbar"; // ✅ import

export default function CreateEvent() {
  const [form, setForm] = useState({});
  const [file, setFile] = useState(null);

  const handleSubmit = async () => {
    try {
      if (!form.title || !form.location || !form.capacity) {
        alert("Fill all required fields");
        return;
      }

      const data = new FormData();
      data.append("title", form.title);
      data.append("location", form.location);
      data.append("price", form.price || 0);
      data.append("capacity", form.capacity);

      if (file) data.append("poster", file);

      await EventAPI.post("/event/create", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Event Created 🎉");

    } catch (err) {
      console.log(err);
      alert("Error creating event");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ✅ NAVBAR ALWAYS TOP */}
      <Navbar />

      {/* ✅ CENTER ONLY FORM */}
      <div className="flex justify-center items-center mt-10">

        <div className="bg-white w-[420px] p-8 rounded-2xl shadow-lg">

          <h2 className="text-2xl font-bold text-center mb-6">
            Create Event
          </h2>

          <input
            type="text"
            placeholder="Event Title"
            className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            onChange={(e)=>setForm({...form,title:e.target.value})}
          />

          <input
            type="text"
            placeholder="Location"
            className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            onChange={(e)=>setForm({...form,location:e.target.value})}
          />

          <input
            type="number"
            placeholder="Price"
            className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            onChange={(e)=>setForm({...form,price:e.target.value})}
          />

          <input
            type="number"
            placeholder="Capacity"
            className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            onChange={(e)=>setForm({...form,capacity:e.target.value})}
          />

          {/* IMAGE */}
          <input
            type="file"
            className="w-full mb-6"
            onChange={(e)=>setFile(e.target.files[0])}
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Create Event
          </button>

        </div>
      </div>
    </div>
  );
}