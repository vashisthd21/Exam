import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:5000";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const { userId, remember, type } = location.state || {};

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [shake, setShake] = useState(false);
  const [dark, setDark] = useState(false);
  const [success, setSuccess] = useState(false);

  const inputsRef = useRef([]);

  useEffect(() => {
    if (!userId) navigate("/login");
  }, [userId, navigate]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((p) => p - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }

    if (newOtp.join("").length === 6) {
      handleVerify(newOtp.join(""));
    }
  };
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];

      if (otp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputsRef.current[index - 1].focus();
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }
  };
  const handleVerify = async (manualOtp) => {
    const finalOtp = manualOtp || otp.join("");

    if (finalOtp.length !== 6) {
      toast.error("Enter complete OTP");
      return;
    }

    setLoading(true);

    try {
      const endpoint =
        type === "register"
          ? "/api/auth/verify-register-otp"
          : "/api/auth/verify-otp";

      const res = await axios.post(
        `${API}${endpoint}`,
        { userId, otp: finalOtp, remember },
        { withCredentials: true }
      );

      login(res.data.user);

      setSuccess(true);
      toast.success("Authentication Successful 🎉");

      setTimeout(() => {
        if (res.data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
      }, 1500);

    } catch (err) {
      setShake(true);
      toast.error(err.response?.data?.message || "Invalid OTP");
      setOtp(Array(6).fill(""));
      inputsRef.current[0]?.focus();
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const endpoint =
        type === "register"
          ? "/api/auth/resend-register-otp"
          : "/api/auth/resend-login-otp";

      await axios.post(`${API}${endpoint}`, { userId });

      setTimer(60);
      toast.success("OTP Resent Successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Resend failed");
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: dark
        ? "linear-gradient(135deg, #111, #1f2937)"
        : "linear-gradient(135deg, #0b3a82, #3b82f6)",
      transition: "0.3s ease",
      position: "relative",
      padding: "20px",
    },

    card: {
      backdropFilter: "blur(20px)",
      background: dark
        ? "rgba(0,0,0,0.6)"
        : "rgba(255,255,255,0.2)",
      padding: "40px 30px",
      borderRadius: "20px",
      width: "100%",
      maxWidth: "400px",
      textAlign: "center",
      color: "#fff",
      boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    },

    title: {
      fontSize: "26px",
      fontWeight: "800",
      marginBottom: "10px",
    },

    subtitle: {
      fontSize: "14px",
      opacity: 0.8,
      marginBottom: "25px",
    },

    otpContainer: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "20px",
    },

    otpInput: {
      width: "45px",
      height: "55px",
      fontSize: "22px",
      textAlign: "center",
      borderRadius: "10px",
      border: "none",
      outline: "none",
      fontWeight: "bold",
    },

    button: {
      width: "100%",
      padding: "12px",
      borderRadius: "10px",
      border: "none",
      background: success ? "#22c55e" : "#2563eb",
      color: "#fff",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "0.3s ease",
    },

    resend: {
      marginTop: "15px",
      fontSize: "14px",
      opacity: 0.8,
    },

    resendBtn: {
      background: "none",
      border: "none",
      color: "#fff",
      fontWeight: "600",
      cursor: "pointer",
    },

    toggle: {
      position: "absolute",
      top: "20px",
      right: "20px",
      background: "none",
      border: "none",
      fontSize: "22px",
      cursor: "pointer",
      color: "#fff",
    },
  };

  return (
    <div style={styles.page}>
      <Toaster position="top-center" />
      
      <button style={styles.toggle} onClick={() => setDark(!dark)}>
        {dark ? "☀️" : "🌙"}
      </button>

      <motion.div
        style={styles.card}
        animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <h2 style={styles.title}>Verify OTP</h2>
        <p style={styles.subtitle}>
          Enter the 6-digit code sent to your email
        </p>

        <div style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              style={styles.otpInput}
            />
          ))}
        </div>

        <button
          style={styles.button}
          disabled={loading}
          onClick={() => handleVerify()}
        >
          {loading
            ? "Verifying..."
            : success
            ? "✔ Verified"
            : "Verify OTP"}
        </button>

        <div style={styles.resend}>
          {timer > 0 ? (
            <p>Resend OTP in {timer}s</p>
          ) : (
            <button style={styles.resendBtn} onClick={handleResend}>
              Resend OTP
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOTP;