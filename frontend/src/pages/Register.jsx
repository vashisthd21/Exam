import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
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
      setError('You must accept Terms & Conditions');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/auth/register`, {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
      setError('Google signup failed');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>
          Start your secure exam journey with ExamSecure
        </p>

        {/* GOOGLE */}
        <div style={styles.centerBlock}>
          <GoogleLogin
            onSuccess={handleGoogleRegister}
            onError={() => setError('Google Sign-Up Failed')}
            width="100%"
          />
        </div>

        <div style={styles.divider}>OR</div>

        <form onSubmit={handleRegister} style={styles.form}>
          <div style={styles.centerBlock}>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.centerBlock}>
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.centerBlock}>
            <div style={styles.passwordRow}>
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                style={styles.passwordInput}
              />
              <span
                style={styles.showHide}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </span>
            </div>
          </div>

          <div style={styles.centerBlock}>
            <label style={styles.checkbox}>
              <input
                type="checkbox"
                name="acceptTerms"
                checked={form.acceptTerms}
                onChange={handleChange}
              />
              <span>
                I agree to the <b>Terms & Conditions</b>
              </span>
            </label>
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <div style={styles.centerBlock}>
            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </div>
        </form>

        <p style={styles.footerText}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Login</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #0b3a82, #eaf1ff)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    fontFamily: "'Segoe UI', Tahoma, sans-serif",
  },

  card: {
    width: '100%',
    maxWidth: 420,
    background: '#fff',
    padding: '40px 35px',
    borderRadius: 18,
    boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
    textAlign: 'center',
  },

  title: {
    fontSize: 30,
    fontWeight: 800,
    color: '#1e293b',
  },

  subtitle: {
    fontSize: 15,
    color: '#64748b',
    marginBottom: 25,
  },

  divider: {
    margin: '18px 0',
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: 600,
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },

  /* 🔑 SINGLE SOURCE OF WIDTH */
  centerBlock: {
    width: '100%',
    maxWidth: 340,
    margin: '0 auto',
  },

  input: {
    width: '100%',
    padding: '14px 16px',
    fontSize: 16,
    borderRadius: 10,
    border: '1.5px solid #cbd5e1',
  },

  passwordRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },

  passwordInput: {
    width: '100%',
    padding: '14px 16px',
    fontSize: 16,
    borderRadius: 10,
    border: '1.5px solid #cbd5e1',
  },

  showHide: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },

  checkbox: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    fontSize: 14,
    color: '#475569',
  },

  button: {
    width: '100%',
    padding: 14,
    fontSize: 18,
    fontWeight: 700,
    background: '#2563eb',
    color: '#fff',
    borderRadius: 10,
    border: 'none',
    cursor: 'pointer',
  },

  error: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: 600,
    textAlign: 'center',
  },

  footerText: {
    marginTop: 20,
    fontSize: 15,
    color: '#475569',
  },

  link: {
    color: '#2563eb',
    fontWeight: 700,
    textDecoration: 'none',
  },
};

export default Register;
