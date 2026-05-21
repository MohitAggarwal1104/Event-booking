import { useState, useEffect } from "react";
import { AuthAPI } from "../services/api";

export default function Auth() {

  const [mode, setMode] = useState("login");
  const [step, setStep] = useState("form");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [login, setLogin] = useState({
    email: "",
    password: ""
  });

  const [signup, setSignup] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [otpData, setOtpData] = useState({
    email: "",
    otp: "",
    newPassword: ""
  });

  // ================= AUTO HIDE TOAST =================

  useEffect(() => {

    if (error || message) {

      const timer = setTimeout(() => {
        setError("");
        setMessage("");
      }, 2000);

      return () => clearTimeout(timer);
    }

  }, [error, message]);

  // ================= LOGIN =================

  const handleLogin = async () => {

    try {

      setLoading(true);
      setError("");
      setMessage("");

      const res = await AuthAPI.post("/auth/login", login);

      localStorage.setItem("token", res.data.data.token);

      window.location.href = "/dashboard";

    } catch (err) {

      setError(
        err.response?.data?.message || "Wrong email or password"
      );

    } finally {

      setLoading(false);

    }
  };

  // ================= SIGNUP =================

  const handleSignup = async () => {

    try {

      setLoading(true);

      setError("");
      setMessage("");

      await AuthAPI.post("/auth/signup", signup);

      setMessage("OTP sent to your email");

      setOtpData({
        ...otpData,
        email: signup.email
      });

      setStep("otp");

    } catch (err) {

      setError(
        err.response?.data?.message || "Signup failed"
      );

    } finally {

      setLoading(false);

    }
  };

  // ================= VERIFY SIGNUP OTP =================

  const handleVerifySignup = async () => {

    try {

      setLoading(true);

      setError("");

      const res = await AuthAPI.post(
        "/auth/verify-email",
        {
          email: otpData.email,
          otp: otpData.otp
        }
      );

      localStorage.setItem(
        "token",
        res.data.data.token
      );

      window.location.href = "/dashboard";

    } catch (err) {

      setError(
        err.response?.data?.message || "Invalid OTP"
      );

    } finally {

      setLoading(false);

    }
  };

  // ================= FORGOT PASSWORD =================

  const handleForgot = async () => {

    try {

      setLoading(true);

      setError("");
      setMessage("");

      await AuthAPI.post(
        "/auth/forgot-password",
        {
          email: otpData.email
        }
      );

      setMessage("OTP sent to email");

      setStep("otp");

    } catch (err) {

      setError(
        err.response?.data?.message || "User not found"
      );

    } finally {

      setLoading(false);

    }
  };

  // ================= RESET PASSWORD =================

  const handleReset = async () => {

    try {

      setLoading(true);

      setError("");

      await AuthAPI.post(
        "/auth/reset-password",
        otpData
      );

      setMessage("Password reset successful");

      setMode("login");

      setStep("form");

    } catch (err) {

      setError(
        err.response?.data?.message || "Invalid OTP"
      );

    } finally {

      setLoading(false);

    }
  };

  // ================= GOOGLE LOGIN =================

  const handleGoogle = () => {

    window.location.href =
      "https://eventbook-login-service.onrender.com/api/auth/google";

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">

      {/* ================= TOAST ================= */}

      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-50 w-[320px]">

        {
          error && (
            <div className="toast error animate-pulse">
              ❌ {error}
            </div>
          )
        }

        {
          message && (
            <div className="toast success animate-pulse">
              ✔ {message}
            </div>
          )
        }

      </div>

      {/* ================= CARD ================= */}

      <div className="w-[900px] h-[520px] bg-white rounded-2xl shadow-xl flex overflow-hidden">

        {/* ================= LEFT ================= */}

        <div className="w-1/2 p-10 flex flex-col justify-center">

          {/* LOGIN */}

          {
            mode === "login" &&
            step === "form" && (

              <>

                <h2 className="text-3xl font-bold mb-4">
                  Login
                </h2>

                <input
                  className="input"
                  placeholder="Email"
                  onChange={(e) =>
                    setLogin({
                      ...login,
                      email: e.target.value
                    })
                  }
                />

                <input
                  type="password"
                  className="input"
                  placeholder="Password"
                  onChange={(e) =>
                    setLogin({
                      ...login,
                      password: e.target.value
                    })
                  }
                />

                <button
                  className="btn"
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {
                    loading
                      ? "Processing..."
                      : "Login"
                  }
                </button>

                <p
                  className="text-blue-500 mt-2 cursor-pointer"
                  onClick={() => {
                    setMode("forgot");
                    setStep("form");
                  }}
                >
                  Forgot Password?
                </p>

                <button
                  className="google-btn mt-3"
                  onClick={handleGoogle}
                >
                  Login with Google
                </button>

                <p className="mt-4">

                  Don't have account?

                  <span
                    className="text-blue-500 cursor-pointer ml-1"
                    onClick={() => {
                      setMode("signup");
                      setStep("form");
                    }}
                  >
                    Signup
                  </span>

                </p>

              </>
            )
          }

          {/* SIGNUP */}

          {
            mode === "signup" &&
            step === "form" && (

              <>

                <h2 className="text-3xl font-bold mb-4">
                  Signup
                </h2>

                <input
                  className="input"
                  placeholder="Name"
                  onChange={(e) =>
                    setSignup({
                      ...signup,
                      name: e.target.value
                    })
                  }
                />

                <input
                  className="input"
                  placeholder="Email"
                  onChange={(e) =>
                    setSignup({
                      ...signup,
                      email: e.target.value
                    })
                  }
                />

                <input
                  type="password"
                  className="input"
                  placeholder="Password"
                  onChange={(e) =>
                    setSignup({
                      ...signup,
                      password: e.target.value
                    })
                  }
                />

                <button
                  className="btn"
                  onClick={handleSignup}
                  disabled={loading}
                >
                  {
                    loading
                      ? "Sending OTP..."
                      : "Signup"
                  }
                </button>

                <p className="mt-4">

                  Already have account?

                  <span
                    className="text-blue-500 cursor-pointer ml-1"
                    onClick={() => {
                      setMode("login");
                      setStep("form");
                    }}
                  >
                    Login
                  </span>

                </p>

              </>
            )
          }

          {/* VERIFY OTP */}

          {
            mode === "signup" &&
            step === "otp" && (

              <>

                <h2 className="text-2xl font-bold mb-3">
                  Verify Email
                </h2>

                <input
                  className="input"
                  placeholder="Enter OTP"
                  onChange={(e) =>
                    setOtpData({
                      ...otpData,
                      otp: e.target.value
                    })
                  }
                />

                <button
                  className="btn"
                  onClick={handleVerifySignup}
                  disabled={loading}
                >
                  {
                    loading
                      ? "Verifying..."
                      : "Verify OTP"
                  }
                </button>

              </>
            )
          }

          {/* FORGOT PASSWORD */}

          {
            mode === "forgot" &&
            step === "form" && (

              <>

                <h2 className="text-2xl font-bold mb-3">
                  Forgot Password
                </h2>

                <input
                  className="input"
                  placeholder="Email"
                  onChange={(e) =>
                    setOtpData({
                      ...otpData,
                      email: e.target.value
                    })
                  }
                />

                <button
                  className="btn"
                  onClick={handleForgot}
                  disabled={loading}
                >
                  {
                    loading
                      ? "Sending OTP..."
                      : "Send OTP"
                  }
                </button>

                <p
                  className="text-blue-500 mt-3 cursor-pointer"
                  onClick={() => setMode("login")}
                >
                  Back to Login
                </p>

              </>
            )
          }

          {/* RESET PASSWORD */}

          {
            mode === "forgot" &&
            step === "otp" && (

              <>

                <h2 className="text-2xl font-bold mb-3">
                  Reset Password
                </h2>

                <input
                  className="input"
                  placeholder="OTP"
                  onChange={(e) =>
                    setOtpData({
                      ...otpData,
                      otp: e.target.value
                    })
                  }
                />

                <input
                  className="input"
                  placeholder="New Password"
                  onChange={(e) =>
                    setOtpData({
                      ...otpData,
                      newPassword: e.target.value
                    })
                  }
                />

                <button
                  className="btn"
                  onClick={handleReset}
                  disabled={loading}
                >
                  {
                    loading
                      ? "Resetting..."
                      : "Reset Password"
                  }
                </button>

              </>
            )
          }

        </div>

        {/* ================= RIGHT ================= */}

        <div className="w-1/2 bg-orange-400 flex items-center justify-center">

          <img
            src="https://img.freepik.com/free-vector/futuristic-astronaut-concept-illustration_114360-7551.jpg"
            className="w-[70%]"
            alt="auth-banner"
          />

        </div>

      </div>

    </div>
  );
}
