import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import { generateToken } from "../config/jwt.js";
import { sendEmail } from "../utils/sendEmail.js";

import {
  successResponse,
  errorResponse
} from "../utils/responseHandler.js";

// ======================================
// GENERATE OTP
// ======================================

const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// ======================================
// SIGNUP
// ======================================

export const signup = async (req, res) => {
  try {

    const { name, email, password } = req.body;

    // CHECK EXISTING USER
    const exists = await User.findOne({ email });

    if (exists) {
      return errorResponse(
        res,
        "User already exists",
        400
      );
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // GENERATE OTP
    const otp = generateOTP();

    // SEND EMAIL FIRST
    await sendEmail(
      email,
      "Verify Email",
      `Your OTP is ${otp}`
    );

    // CREATE USER
    await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiry: Date.now() + 10 * 60 * 1000,
      isVerified: false
    });

    return successResponse(
      res,
      {},
      "OTP sent to email",
      201
    );

  } catch (err) {

    console.log(err);

    return errorResponse(
      res,
      err.message || "Signup failed"
    );
  }
};

// ======================================
// VERIFY EMAIL
// ======================================

export const verifyEmail = async (req, res) => {
  try {

    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (
      !user ||
      user.otp !== otp ||
      user.otpExpiry < Date.now()
    ) {
      return errorResponse(
        res,
        "Invalid or expired OTP",
        400
      );
    }

    // VERIFY USER
    user.isVerified = true;

    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    // GENERATE TOKEN
    const token = generateToken(user);

    return successResponse(
      res,
      {
        token,
        user
      },
      "Email verified"
    );

  } catch (err) {

    console.log(err);

    return errorResponse(
      res,
      err.message
    );
  }
};

// ======================================
// LOGIN
// ======================================

export const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // USER CHECK
    if (!user) {
      return errorResponse(
        res,
        "User not found",
        400
      );
    }

    // VERIFIED CHECK
    if (!user.isVerified) {
      return errorResponse(
        res,
        "Email not verified",
        403
      );
    }

    // PASSWORD CHECK
    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match) {
      return errorResponse(
        res,
        "Invalid credentials",
        400
      );
    }

    // TOKEN
    const token = generateToken(user);

    return successResponse(
      res,
      {
        token,
        user
      },
      "Login successful"
    );

  } catch (err) {

    console.log(err);

    return errorResponse(
      res,
      err.message
    );
  }
};

// ======================================
// FORGOT PASSWORD
// ======================================

export const forgotPassword = async (req, res) => {
  try {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // GENERATE OTP
    const otp = generateOTP();

    user.otp = otp;

    user.otpExpiry =
      Date.now() + 5 * 60 * 1000;

    await user.save();

    // SEND EMAIL
    await sendEmail(
      email,
      "Password Reset OTP",
      `Your OTP is ${otp}`
    );

    return res.json({
      message: "OTP sent to email"
    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      message: "Server error"
    });
  }
};

// ======================================
// RESET PASSWORD
// ======================================

export const resetPassword = async (req, res) => {
  try {

    const {
      email,
      otp,
      newPassword
    } = req.body;

    const user = await User.findOne({ email });

    // USER CHECK
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // OTP CHECK
    if (
      user.otp !== otp ||
      user.otpExpiry < Date.now()
    ) {
      return res.status(400).json({
        message: "Invalid or expired OTP"
      });
    }

    // HASH NEW PASSWORD
    const hashedPassword =
      await bcrypt.hash(newPassword, 10);

    // UPDATE PASSWORD
    user.password = hashedPassword;

    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    return res.json({
      message: "Password reset successful"
    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      message: "Server error"
    });
  }
};
