import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import passport from "./config/passport.js";

const app = express();

// ================= TRUST PROXY =================

app.set("trust proxy", 1);

// ================= DATABASE =================

connectDB();

// ================= CORS =================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://event-booking-indol-ten.vercel.app"
    ],

    credentials: true
  })
);

// ================= JSON =================

app.use(express.json());

// ================= SESSION =================

app.use(
  session({
    secret: process.env.SESSION_SECRET || "eventbooksecret",

    resave: false,

    saveUninitialized: false,

    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI
    }),

    cookie: {
      secure: process.env.NODE_ENV === "production",

      sameSite:
        process.env.NODE_ENV === "production"
          ? "none"
          : "lax",

      maxAge: 1000 * 60 * 60 * 24 * 7
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
