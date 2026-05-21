import express from "express";
import passport from "passport";

import {
  signup,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword
} from "../controllers/authController.js";

import { generateToken } from "../config/jwt.js";

const router = express.Router();

// ================= NORMAL AUTH =================

router.post("/signup", signup);

router.post("/verify-email", verifyEmail);

router.post("/login", login);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

// ================= GOOGLE LOGIN =================

// START GOOGLE LOGIN
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

// GOOGLE CALLBACK
router.get(
  "/google/callback",

  passport.authenticate("google", {
    failureRedirect:
      process.env.NODE_ENV === "production"
        ? "https://event-booking-indol-ten.vercel.app/login"
        : "http://localhost:5173/login",
    session: false
  }),

  async (req, res) => {
    try {

      const token = generateToken(req.user);

      const redirectURL =
        process.env.NODE_ENV === "production"
          ? "https://event-booking-indol-ten.vercel.app"
          : "http://localhost:5173";

      res.redirect(
        `${redirectURL}/dashboard?token=${token}`
      );

    } catch (err) {

      res.status(500).json({
        message: "Google login failed"
      });

    }
  }
);

export default router;
