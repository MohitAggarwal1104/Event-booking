import { useState } from "react";
import API from "../services/api";

export default function Verify() {
  const [data, setData] = useState({ email: "", otp: "" });

  const handleVerify = async () => {
    const res = await API.post("/auth/verify-email", data);
    localStorage.setItem("token", res.data.data.token);
    window.location.href = "/dashboard";
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl mb-3">Verify Email</h2>

        <input placeholder="Email" className="w-full mb-2 p-2 border"
          onChange={e => setData({...data, email: e.target.value})} />

        <input placeholder="OTP" className="w-full mb-2 p-2 border"
          onChange={e => setData({...data, otp: e.target.value})} />

        <button className="w-full bg-black text-white p-2"
          onClick={handleVerify}>
          Verify
        </button>
      </div>
    </div>
  );
}