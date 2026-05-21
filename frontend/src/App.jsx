import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CreateEvent from "./pages/CreateEvent";
import Bookings from "./pages/Bookings";
import Scanner from "./pages/Scanner";

export default function App() {

  useEffect(() => {

    const script = document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    document.body.appendChild(script);

  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<CreateEvent />} />
        <Route path="/scan" element={<Scanner />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/scanner" element={<Scanner />} />
      </Routes>
    </BrowserRouter>
  );
}
