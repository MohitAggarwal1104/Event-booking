import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { EventAPI } from "../services/api";
import Navbar from "../components/Navbar";

export default function ScanPage() {
  const [result, setResult] = useState("");

  const handleScan = async (data) => {
    if (!data) return;

    try {
      console.log("QR:", data);

      const res = await EventAPI.post("/booking/scan", {
        bookingId: data
      });

      setResult(res.data.message);

    } catch (err) {
      setResult(err.response?.data?.message || "Invalid QR");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="flex flex-col items-center mt-10">

        <h2 className="text-2xl font-bold mb-4">
          Scan Ticket 🎟
        </h2>

        <div className="w-[300px]">
          <Scanner
            onResult={(text) => handleScan(text)}
          />
        </div>

        {result && (
          <p className="mt-6 text-lg font-semibold">
            {result}
          </p>
        )}
      </div>
    </div>
  );
}