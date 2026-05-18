import dotenv from "dotenv";
dotenv.config(); // ✅ FIRST LINE

import express from "express";
import cors from "cors";
import session from "express-session";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import passport from "./config/passport.js";

const app = express(); // ✅ create app BEFORE using it

// DB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Session (required for passport)
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Auth Service Running 🚀");
});

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});