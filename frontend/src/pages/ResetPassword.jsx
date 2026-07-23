import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Shield, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await axios.post(`${API}/api/auth/reset-password/${token}`, { password });
      setMessage(res.data.message || 'Password successfully updated!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Link may be expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        body { margin: 0; background: #F8FAFC; font-family: 'Inter', -apple-system, sans-serif; }
        .glass-card { background: #FFFFFF; border: 1px solid #E2E8F0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02); border-radius: 20px; }
        .form-input:focus { outline: none; border-color: #2563EB; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15); }
      `}</style>
      <div style={styles.page}>
        <div style={styles.card} className="glass-card">
          <div style={styles.brandHeader}>
            <div style={styles.logoIconBox}>
              <Shield size={24} color="#2563EB" />
            </div>
            <h2 style={styles.title}>Set New Password</h2>
            <p style={styles.subtitle}>Please enter your new secure password below.</p>
          </div>

          <form onSubmit={handleReset} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>New Password</label>
              <div style={styles.inputWrapper}>
                <Lock size={16} color="#94A3B8" style={styles.inputIcon} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={styles.input}
                  className="form-input"
                />
                <button
                  type="button"
                  style={styles.showHideBtn}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} color="#64748B" /> : <Eye size={16} color="#64748B" />}
                </button>
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Confirm New Password</label>
              <div style={styles.inputWrapper}>
                <Lock size={16} color="#94A3B8" style={styles.inputIcon} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={styles.input}
                  className="form-input"
                />
              </div>
            </div>

            {error && <div style={styles.errorBox}>{error}</div>}
            {message && <div style={styles.successBox}>{message}</div>}

            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? 'Updating...' : 'Reset Password'} <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

const styles = {
  page: { minHeight: '100vh', background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: { width: '100%', maxWidth: 440, background: '#FFFFFF', padding: '40px 36px', boxSizing: 'border-box' },
  brandHeader: { textAlign: 'center', marginBottom: 28 },
  logoIconBox: { width: 48, height: 48, borderRadius: 12, background: '#EFF6FF', border: '1px solid #BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' },
  title: { margin: '0 0 6px 0', fontSize: 24, fontWeight: 700, color: '#0F172A' },
  subtitle: { margin: 0, fontSize: 14, color: '#64748B' },
  form: { display: 'flex', flexDirection: 'column', gap: 18 },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: 6 },
  inputLabel: { fontSize: 13, fontWeight: 600, color: '#334155' },
  inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  inputIcon: { position: 'absolute', left: 14 },
  input: { width: '100%', padding: '12px 40px', fontSize: 14, borderRadius: 10, border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#0F172A', boxSizing: 'border-box' },
  showHideBtn: { position: 'absolute', right: 12, background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', padding: 4 },
  button: { width: '100%', padding: '12px 16px', fontSize: 15, fontWeight: 600, background: '#2563EB', color: '#FFFFFF', borderRadius: 10, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4 },
  errorBox: { background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '10px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, textAlign: 'center' },
  successBox: { background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', padding: '10px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, textAlign: 'center' },
};

export default ResetPassword;