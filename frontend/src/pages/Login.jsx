import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
const API = import.meta.env.VITE_API_BASE_URL;
console.log(API);
const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(
        `${API}/api/auth/login`,
        form
      );

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (cred) => {
    try {
      const res = await axios.post(
        `${API}/api/auth/google`,
        { token: cred.credential }
      );

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch(e){
      console.log(e);
      setError('Google login failed');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>
          Log in to continue your secure exam journey
        </p>

        {/* GOOGLE LOGIN */}
        <div style={styles.centerBlock}>
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => setError('Google Sign-In Failed')}
            width="100%"
          />
        </div>

        <div style={styles.divider}>OR</div>

        {/* LOGIN FORM */}
        <form onSubmit={handleLogin} style={styles.form}>
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
            <div style={styles.options}>
              <label style={styles.remember}>
                <input type="checkbox" />
                Remember me
              </label>
              <span style={styles.forgot}>Forgot password?</span>
            </div>
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <div style={styles.centerBlock}>
            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>

        <p style={styles.footerText}>
          Don’t have an account?{' '}
          <Link to="/register" style={styles.link}>
            Sign up
          </Link>
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

  /* SAME WIDTH CONTROLLER AS REGISTER */
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

  options: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 13,
    color: '#475569',
  },

  remember: {
    display: 'flex',
    gap: 6,
    alignItems: 'center',
  },

  forgot: {
    color: '#2563eb',
    cursor: 'pointer',
    fontWeight: 600,
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

export default Login;
