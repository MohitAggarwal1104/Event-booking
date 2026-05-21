import axios from "axios";

// AUTH SERVICE
export const AuthAPI = axios.create({
  baseURL: "https://eventbook-login-service.onrender.com/api"
});

// EVENT SERVICE
export const EventAPI = axios.create({
  baseURL: "https://event-booking-jrvy.onrender.com/api"
});

// 🔥 attach token automatically
EventAPI.interceptors.request.use((config) => {

  const token = localStorage.getItem("token");

  console.log("🔐 TOKEN:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.log("❌ No token found");
  }

  return config;
});
