import axios from "axios";

// AUTH SERVICE
export const AuthAPI = axios.create({
  baseURL: "http://localhost:5000/api"
});

// EVENT SERVICE
export const EventAPI = axios.create({
  baseURL: "http://localhost:5001/api"
});

// 🔥 attach token automatically
EventAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  console.log("🔐 TOKEN:", token); // DEBUG

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.log("❌ No token found");
  }

  return config;
});