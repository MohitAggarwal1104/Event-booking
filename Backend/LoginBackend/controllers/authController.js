import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateToken } from "../config/jwt.js";
import { sendEmail } from "../utils/sendEmail.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";

// GENERATE OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// SIGNUP
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return errorResponse(res, "User already exists", 400);

    const hashed = await bcrypt.hash(password, 10);

    const otp = generateOTP();

    const user = await User.create({
      name,
      email,
      password: hashed,
      otp,
      otpExpiry: Date.now() + 10 * 60 * 1000
    });

    await sendEmail(email, "Verify Email", `Your OTP is ${otp}`);

    return successResponse(res, {}, "OTP sent to email", 201);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// VERIFY EMAIL
export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
      return errorResponse(res, "Invalid or expired OTP", 400);
    }

    user.isVerified = true;
    user.otp = null;
    await user.save();

    const token = generateToken(user);

    return successResponse(res, { token }, "Email verified");
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return errorResponse(res, "User not found", 400);

    if (!user.isVerified)
      return errorResponse(res, "Email not verified", 403);

    const match = await bcrypt.compare(password, user.password);

    if (!match) return errorResponse(res, "Invalid credentials", 400);

    const token = generateToken(user);

    return successResponse(res, { token, user }, "Login success");
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // 🔥 IMPORTANT CHECK
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpire = Date.now() + 5 * 60 * 1000;
    await user.save();

    await sendEmail(email, "Password Reset OTP", `Your OTP: ${otp}`);

    res.json({ message: "OTP sent to email" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });

    // 🔥 CHECK USER
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // 🔥 CHECK OTP
    if (
      user.otp !== otp ||
      user.otpExpire < Date.now()
    ) {
      return res.status(400).json({
        message: "Invalid or expired OTP"
      });
    }

    user.password = newPassword; // (hash if needed)
    user.otp = null;
    user.otpExpire = null;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};