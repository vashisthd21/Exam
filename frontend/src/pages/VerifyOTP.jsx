import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, RefreshCw, Sun, Moon, ArrowRight } from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL;

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const login = auth?.login;

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
      toast.error("Please enter the complete 6-digit code.");
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

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (login) login(res.data.user);

      setSuccess(true);
      toast.success("Verification successful!");

      setTimeout(() => {
        if (res.data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard");
        }
      }, 1200);

    } catch (err) {
      setShake(true);
      toast.error(err.response?.data?.message || "Invalid OTP code.");
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
          ? "/api/auth/register"
          : "/api/auth/resend-login-otp";

      await axios.post(`${API}${endpoint}`, { userId });

      setTimer(60);
      toast.success("New verification code sent.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP.");
    }
  };

  return (
    <>
      <style>{`
        body { margin: 0; font-family: 'Inter', -apple-system, sans-serif; }
        .otp-input:focus {
          border-color: #2563EB !important;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
          outline: none;
        }
        .btn-hover { transition: all 0.2s ease; }
        .btn-hover:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.3);
        }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
      `}</style>

      <div style={{ ...styles.page, background: dark ? "#0F172A" : "#F8FAFC" }}>
        <Toaster position="top-center" />

        {/* Theme Toggle */}
        <button 
          style={{ ...styles.toggle, color: dark ? "#F8FAFC" : "#0F172A" }} 
          onClick={() => setDark(!dark)}
          aria-label="Toggle Theme"
        >
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <motion.div
          style={{
            ...styles.card,
            background: dark ? "rgba(30, 41, 59, 0.85)" : "rgba(255, 255, 255, 0.95)",
            borderColor: dark ? "#334155" : "#E2E8F0",
            color: dark ? "#F8FAFC" : "#0F172A",
          }}
          className="glass-card"
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          <div style={styles.iconContainer}>
            <ShieldCheck size={28} color="#2563EB" />
          </div>

          <h2 style={styles.title}>Security Verification</h2>
          <p style={{ ...styles.subtitle, color: dark ? "#94A3B8" : "#64748B" }}>
            Enter the 6-digit verification code sent to your registered email address.
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
                onPaste={(e) => {
                  const pasted = e.clipboardData.getData("text").slice(0, 6);
                  if (/^\d{6}$/.test(pasted)) {
                    setOtp(pasted.split(""));
                    handleVerify(pasted);
                  }
                }}
                className="otp-input"
                style={{
                  ...styles.otpInput,
                  background: dark ? "#0F172A" : "#F8FAFC",
                  color: dark ? "#F8FAFC" : "#0F172A",
                  borderColor: dark ? "#334155" : "#CBD5E1",
                }}
              />
            ))}
          </div>

          <button
            style={{
              ...styles.button,
              background: success ? "#10B981" : "#2563EB",
            }}
            disabled={loading}
            onClick={() => handleVerify()}
            className="btn-hover"
          >
            {loading ? (
              <span>Verifying...</span>
            ) : success ? (
              <span>Verified Successfully</span>
            ) : (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                Verify & Proceed <ArrowRight size={16} />
              </span>
            )}
          </button>

          <div style={{ ...styles.resend, color: dark ? "#94A3B8" : "#64748B" }}>
            {timer > 0 ? (
              <p style={{ margin: 0 }}>Resend code in <strong style={{ color: dark ? "#E2E8F0" : "#334155" }}>{timer}s</strong></p>
            ) : (
              <button style={styles.resendBtn} onClick={handleResend}>
                <RefreshCw size={14} /> Resend Verification Code
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "background 0.3s ease",
    position: "relative",
    padding: "20px",
  },

  card: {
    backdropFilter: "blur(16px)",
    padding: "40px 36px",
    borderRadius: "24px",
    width: "100%",
    maxWidth: "440px",
    textAlign: "center",
    border: "1px solid",
    boxShadow: "0 20px 40px -15px rgba(0,0,0,0.1)",
  },

  iconContainer: {
    width: "56px",
    height: "56px",
    borderRadius: "16px",
    background: "#EFF6FF",
    border: "1px solid #BFDBFE",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px auto",
  },

  title: {
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "8px",
    letterSpacing: "-0.02em",
  },

  subtitle: {
    fontSize: "14px",
    lineHeight: "1.5",
    marginBottom: "30px",
  },

  otpContainer: {
    display: "flex",
    justifyContent: "space-between",
    gap: "8px",
    marginBottom: "28px",
  },

  otpInput: {
    width: "48px",
    height: "56px",
    fontSize: "20px",
    textAlign: "center",
    borderRadius: "12px",
    border: "1.5px solid",
    fontWeight: "600",
    transition: "all 0.2s ease",
  },

  button: {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    color: "#fff",
    fontWeight: "600",
    fontSize: "15px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(37,99,235,0.2)",
  },

  resend: {
    marginTop: "24px",
    fontSize: "13px",
  },

  resendBtn: {
    background: "none",
    border: "none",
    color: "#2563EB",
    fontWeight: "600",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "13px",
  },

  toggle: {
    position: "absolute",
    top: "24px",
    right: "24px",
    background: "transparent",
    border: "1px solid rgba(100, 116, 139, 0.2)",
    borderRadius: "10px",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "background 0.2s ease",
  },
};

export default VerifyOTP;