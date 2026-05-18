import { useState } from "react";
import API from "../services/api";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleSignup = async () => {
    await API.post("/auth/signup", form);
    alert("OTP sent to email");
    window.location.href = "/verify";
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-96">
        <h2 className="text-2xl font-bold mb-4">Signup</h2>

        <input placeholder="Name" className="w-full mb-2 p-2 border rounded"
          onChange={e => setForm({...form, name: e.target.value})} />

        <input placeholder="Email" className="w-full mb-2 p-2 border rounded"
          onChange={e => setForm({...form, email: e.target.value})} />

        <input type="password" placeholder="Password"
          className="w-full mb-2 p-2 border rounded"
          onChange={e => setForm({...form, password: e.target.value})} />

        <button className="w-full bg-black text-white p-2 rounded"
          onClick={handleSignup}>
          Signup
        </button>
      </div>
    </div>
  );
}