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

// ================= AUTH =================
router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// ================= GOOGLE AUTH =================

// STEP 1: Redirect to Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// STEP 2: Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = generateToken(req.user);

    // redirect to frontend with token
    res.redirect(`http://localhost:5173/dashboard?token=${token}`);
  }
);

export default router;