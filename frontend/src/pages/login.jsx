import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // States for hover styling
  const [btnHover, setBtnHover] = useState(false);
  const [emailHover, setEmailHover] = useState(false);
  const [passHover, setPassHover] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('https://exam-86ot.onrender.com/api/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/dashboard');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError(err.response?.data?.message || 'Login failed. Please try again.');
      }
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <h2 style={styles.title}>Secure Exam Login</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              ...styles.input,
              borderColor: emailHover ? '#5a67d8' : '#ccc',
              boxShadow: emailHover ? '0 0 8px #5a67d8' : 'none',
            }}
            onMouseEnter={() => setEmailHover(true)}
            onMouseLeave={() => setEmailHover(false)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              ...styles.input,
              borderColor: passHover ? '#5a67d8' : '#ccc',
              boxShadow: passHover ? '0 0 8px #5a67d8' : 'none',
            }}
            onMouseEnter={() => setPassHover(true)}
            onMouseLeave={() => setPassHover(false)}
          />
          {error && <p style={styles.error}>{error}</p>}
          <button
            type="submit"
            style={{
              ...styles.button,
              backgroundColor: btnHover ? '#434190' : '#5a67d8',
              boxShadow: btnHover
                ? '0 12px 24px rgba(67, 65, 144, 0.6)'
                : '0 8px 15px rgba(90, 103, 216, 0.4)',
              transform: btnHover ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
          >
            Log In
          </button>
        </form>
        <p style={styles.linkText}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    height: '97vh', // full viewport height
    width: '99vw',  // full viewport width
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,    // no padding to cover full bg
    margin: 0,     // no margin
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    overflow: 'hidden', // prevent scrollbars
  },
  container: {
    width: '100%',
    maxWidth: '420px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '16px',
    boxShadow:
      '0 15px 25px rgba(0,0,0,0.2), 0 5px 10px rgba(0,0,0,0.1)',
    padding: '40px 50px',
    boxSizing: 'border-box',
    textAlign: 'center',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  title: {
    marginBottom: '30px',
    color: '#2d3748',
    fontWeight: '800',
    fontSize: '32px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  input: {
    padding: '15px 18px',
    fontSize: '16px',
    borderRadius: '10px',
    border: '1.8px solid #ccc',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
  },
  button: {
    padding: '16px',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '20px',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
  },
  error: {
    color: '#e53e3e',
    fontSize: '14px',
    fontWeight: '700',
    marginTop: '-10px',
    marginBottom: '10px',
  },
  linkText: {
    marginTop: '25px',
    fontSize: '15px',
    color: '#4a5568',
  },
  link: {
    color: '#5a67d8',
    textDecoration: 'none',
    fontWeight: '700',
    transition: 'color 0.3s ease',
  },
};

export default Login;
