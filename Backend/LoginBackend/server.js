import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import session from "express-session";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import passport from "./config/passport.js";

const app = express();

// ================= DATABASE =================

connectDB();

// ================= MIDDLEWARES =================

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://event-booking-indol-ten.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());

// ================= SESSION =================

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      sameSite: "none"
    }
  })
);

// ================= PASSPORT =================

app.use(passport.initialize());
app.use(passport.session());

// ================= ROUTES =================

app.use("/api/auth", authRoutes);

// ================= TEST ROUTE =================

app.get("/", (req, res) => {
  res.send("Auth Service Running 🚀");
});

// ================= START SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
