import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('');
  const [forgotError, setForgotError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError('');
    setForgotMessage('');

    try {
      const res = await axios.post(`${API}/api/auth/forgot-password`, { email: forgotEmail });
      setForgotMessage(res.data.message || 'Password reset link sent to your email.');
    } catch (err) {
      setForgotError(err.response?.data?.message || 'Failed to send reset email. Try again.');
    } finally {
      setForgotLoading(false);
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(`${API}/api/auth/login`, form);

      // If OTP required
      if (res.data.requireOTP) {
        navigate('/verify-otp', {
          state: {
            userId: res.data.userId,
            remember: res.data.remember
          }
        });
        return;
      }

      const { user } = res.data;
      
      // Save token if backend sends it
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      // Save user
      localStorage.setItem("user", JSON.stringify(user));

      // Role-based redirection
      switch (user.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "teacher":
          navigate("/teacher/dashboard");
          break;
        case "student":
        case "user":
        default:
          navigate("/dashboard");
          break;
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (cred) => {
    try {
      const res = await axios.post(
        `${API}/api/auth/google`,
        { token: cred.credential },
        { withCredentials: true }
      );

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Role-based redirection
      switch (user.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "teacher":
          navigate("/teacher/dashboard");
          break;
        case "student":
        case "user":
        default:
          navigate("/dashboard");
          break;
      }

    } catch (e) {
      console.log(e);
      setError('Google Sign-In failed. Please try again.');
    }
  };

  return (
    <>
      <style>{`
        body { margin: 0; background: #F8FAFC; font-family: 'Inter', -apple-system, sans-serif; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        
        .glass-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 12px 24px -4px rgba(0, 0, 0, 0.04);
          border-radius: 20px;
        }

        .btn-primary { transition: all 0.2s ease; }
        .btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(37, 99, 235, 0.25); background: #1D4ED8 !important; }
        
        .form-input:focus {
          outline: none;
          border-color: #2563EB;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }

        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 4px; }
      `}</style>

      <div style={styles.page} className="animate-fade-in">
        <div style={styles.card} className="glass-card">
          
          {/* Logo / Badge */}
          <div style={styles.brandHeader}>
            <div style={styles.logoIconBox}>
              <Shield size={24} color="#2563EB" />
            </div>
            <h2 style={styles.title}>Welcome Back</h2>
            <p style={styles.subtitle}>
              Sign in to continue your secure exam journey
            </p>
          </div>

          {/* GOOGLE LOGIN */}
          <div style={styles.googleBlock}>
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => setError('Google Sign-In Failed')}
              width="100%"
              theme="outline"
              shape="pill"
            />
          </div>

          <div style={styles.dividerContainer}>
            <div style={styles.dividerLine}></div>
            <span style={styles.dividerText}>or continue with email</span>
            <div style={styles.dividerLine}></div>
          </div>

          {/* LOGIN FORM */}
          <form onSubmit={handleLogin} style={styles.form}>
            
            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Email Address</label>
              <div style={styles.inputWrapper}>
                <Mail size={16} color="#94A3B8" style={styles.inputIcon} />
                <input
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  className="form-input"
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <div style={styles.passwordLabelRow}>
                <label style={styles.inputLabel}>Password</label>
                <span style={styles.forgot} onClick={() => setShowForgotModal(true)}>Forgot password?</span>
              </div>
              <div style={styles.inputWrapper}>
                <Lock size={16} color="#94A3B8" style={styles.inputIcon} />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  style={styles.inputWithIconRight}
                  className="form-input"
                />
                <button
                  type="button"
                  style={styles.showHideBtn}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} color="#64748B" /> : <Eye size={16} color="#64748B" />}
                </button>
              </div>
            </div>

            <div style={styles.optionsRow}>
              <label style={styles.remember}>
                <input type="checkbox" style={styles.checkbox} />
                <span>Remember me for 30 days</span>
              </label>
            </div>

            {error && <div style={styles.errorBox}>{error}</div>}

            <button type="submit" disabled={loading} style={styles.button} className="btn-primary">
              {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={16} />
            </button>
          </form>

          <p style={styles.footerText}>
            Don’t have an account?{' '}
            <Link to="/register" style={styles.link}>
              Create an account
            </Link>
          </p>
        </div>
        {/* ===== FORGOT PASSWORD MODAL ===== */}
        {showForgotModal && (
          <div style={styles.modalOverlay} onClick={() => setShowForgotModal(false)}>
            <div style={styles.modalCard} className="animate-slide-up" onClick={(e) => e.stopPropagation()}>
              <h3 style={styles.modalTitle}>Reset Password</h3>
              <p style={styles.modalSub}>Enter your account email and we'll send you a link to reset your password.</p>
              
              <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                  style={styles.input}
                  className="form-input"
                />

                {forgotMessage && <div style={styles.successBox}>{forgotMessage}</div>}
                {forgotError && <div style={styles.errorBox}>{forgotError}</div>}

                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  <button
                    type="button"
                    style={styles.modalCancelBtn}
                    onClick={() => setShowForgotModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    style={styles.modalSubmitBtn}
                    className="btn-primary"
                  >
                    {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  card: {
    width: '100%',
    maxWidth: 440,
    background: '#FFFFFF',
    padding: '40px 36px',
    boxSizing: 'border-box',
  },

  brandHeader: {
    textAlign: 'center',
    marginBottom: 28,
  },

  logoIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    background: '#EFF6FF',
    border: '1px solid #BFDBFE',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px auto',
  },

  title: {
    margin: '0 0 6px 0',
    fontSize: 24,
    fontWeight: 700,
    color: '#0F172A',
    letterSpacing: '-0.02em',
  },

  subtitle: {
    margin: 0,
    fontSize: 14,
    color: '#64748B',
  },

  googleBlock: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 20,
  },

  dividerContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    margin: '20px 0',
  },

  dividerLine: {
    flex: 1,
    height: 1,
    background: '#E2E8F0',
  },

  dividerText: {
    fontSize: 12,
    fontWeight: 600,
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  },

  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: '#334155',
  },

  passwordLabelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },

  inputIcon: {
    position: 'absolute',
    left: 14,
  },

  input: {
    width: '100%',
    padding: '12px 14px 12px 40px',
    fontSize: 14,
    borderRadius: 10,
    border: '1px solid #CBD5E1',
    background: '#FFFFFF',
    color: '#0F172A',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },

  inputWithIconRight: {
    width: '100%',
    padding: '12px 40px 12px 40px',
    fontSize: 14,
    borderRadius: 10,
    border: '1px solid #CBD5E1',
    background: '#FFFFFF',
    color: '#0F172A',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },

  showHideBtn: {
    position: 'absolute',
    right: 12,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: 4,
  },

  optionsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: 13,
  },

  remember: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    color: '#475569',
    cursor: 'pointer',
    fontWeight: 500,
  },

  checkbox: {
    width: 16,
    height: 16,
    accentColor: '#2563EB',
    cursor: 'pointer',
  },

  forgot: {
    color: '#2563EB',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 13,
    textDecoration: 'none',
  },

  button: {
    width: '100%',
    padding: '12px 16px',
    fontSize: 15,
    fontWeight: 600,
    background: '#2563EB',
    color: '#FFFFFF',
    borderRadius: 10,
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },

  errorBox: {
    background: '#FEF2F2',
    border: '1px solid #FECACA',
    color: '#DC2626',
    padding: '10px 14px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    textAlign: 'center',
  },

  footerText: {
    marginTop: 24,
    textAlign: 'center',
    fontSize: 14,
    color: '#64748B',
  },

  link: {
    color: '#2563EB',
    fontWeight: 600,
    textDecoration: 'none',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 23, 42, 0.5)',
    backdropFilter: 'blur(6px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: 20,
  },
  modalCard: {
    background: '#FFFFFF',
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: '32px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    border: '1px solid #E2E8F0',
    textAlign: 'left',
  },
  modalTitle: {
    margin: '0 0 6px 0',
    fontSize: 18,
    fontWeight: 700,
    color: '#0F172A',
  },
  modalSub: {
    margin: '0 0 20px 0',
    fontSize: 13,
    color: '#64748B',
    lineHeight: 1.4,
  },
  modalCancelBtn: {
    flex: 1,
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    color: '#475569',
    padding: '10px 16px',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  modalSubmitBtn: {
    flex: 1,
    background: '#2563EB',
    border: 'none',
    color: '#FFFFFF',
    padding: '10px 16px',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  successBox: {
    background: '#ECFDF5',
    border: '1px solid #A7F3D0',
    color: '#065F46',
    padding: '10px 14px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    textAlign: 'center',
  },
};

export default Login;