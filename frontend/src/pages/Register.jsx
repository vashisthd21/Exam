import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { Shield, User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    acceptTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.acceptTerms) {
      setError('You must accept the Terms & Conditions to proceed.');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${API}/api/auth/register`, {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      if (res.data.requireOTP) {
        navigate('/verify-otp', {
          state: {
            userId: res.data.userId,
            type: 'register'
          }
        });
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async (credentialResponse) => {
    try {
      const res = await axios.post(
        `${API}/api/auth/google`,
        { token: credentialResponse.credential }
      );

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch {
      setError('Google signup failed. Please try again.');
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
          
          {/* Logo / Header */}
          <div style={styles.brandHeader}>
            <div style={styles.logoIconBox}>
              <Shield size={24} color="#2563EB" />
            </div>
            <h2 style={styles.title}>Create Account</h2>
            <p style={styles.subtitle}>
              Start your secure exam journey with ExamSecure
            </p>
          </div>

          {/* GOOGLE SIGN UP */}
          <div style={styles.googleBlock}>
            <GoogleLogin
              onSuccess={handleGoogleRegister}
              onError={() => setError('Google Sign-Up Failed')}
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

          {/* REGISTRATION FORM */}
          <form onSubmit={handleRegister} style={styles.form}>
            
            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Full Name</label>
              <div style={styles.inputWrapper}>
                <User size={16} color="#94A3B8" style={styles.inputIcon} />
                <input
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  className="form-input"
                />
              </div>
            </div>

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
              <label style={styles.inputLabel}>Password</label>
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
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={form.acceptTerms}
                  onChange={handleChange}
                  style={styles.checkbox}
                />
                <span style={styles.checkboxText}>
                  I agree to the <span style={styles.linkText}>Terms & Conditions</span>
                </span>
              </label>
            </div>

            {error && <div style={styles.errorBox}>{error}</div>}

            <button type="submit" disabled={loading} style={styles.button} className="btn-primary">
              {loading ? 'Creating Account...' : 'Create Account'} <ArrowRight size={16} />
            </button>
          </form>

          <p style={styles.footerText}>
            Already have an account?{' '}
            <Link to="/login" style={styles.link}>
              Sign in
            </Link>
          </p>
        </div>
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
    gap: 16,
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
    marginTop: 4,
  },

  checkboxLabel: {
    display: 'flex',
    gap: 10,
    alignItems: 'flex-start',
    cursor: 'pointer',
  },

  checkbox: {
    width: 16,
    height: 16,
    marginTop: 2,
    accentColor: '#2563EB',
    cursor: 'pointer',
  },

  checkboxText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: 500,
    lineHeight: 1.4,
  },

  linkText: {
    color: '#2563EB',
    fontWeight: 600,
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
    marginTop: 8,
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
};

export default Register;