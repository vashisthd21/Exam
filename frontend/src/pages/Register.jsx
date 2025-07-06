import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Hover states for inputs and button
  const [btnHover, setBtnHover] = useState(false);
  const [nameHover, setNameHover] = useState(false);
  const [emailHover, setEmailHover] = useState(false);
  const [passHover, setPassHover] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('https://exam-86ot.onrender.com/api/auth/register', {
        name,
        email,
        password,
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error : ', err);
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <h2 style={styles.title}>Secure Exam Register</h2>
        <form onSubmit={handleRegister} style={styles.form}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              ...styles.input,
              borderColor: nameHover ? '#5a67d8' : '#ccc',
              boxShadow: nameHover ? '0 0 8px #5a67d8' : 'none',
            }}
            onMouseEnter={() => setNameHover(true)}
            onMouseLeave={() => setNameHover(false)}
          />
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
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '30px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
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
};

export default Register;
