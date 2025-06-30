import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [error,setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        try{
            const response = await axios.post('https://exam-86ot.onrender.com/api/auth/register',{
                name,
                email,
                password
            });
            const {token,user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            navigate('/dashboard');
        }
        catch(err){
            console.error('Registration error : ',err);
            setError(err.response?.data?.message || 'Registration failed');

        }
    };
    return (
        <div style={styles.pageContainer}>
            <div style={styles.container}>
                <h2 style={styles.title}>Secure Exam Register</h2>
                <form onSubmit={handleRegister} style={styles.form}>
                    <input type="text" placeholder='Full Name' value={name} onChange={(e) => setName(e.target.value)} required style={styles.input} />
                    <input type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input}/>
                    <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required style={styles.input}/>
                    {error && <p style={styles.error}>{error}</p>}
                    <button type="submit" style={styles.button}>
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    pageContainer: {
        minHeight: '90vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
    },
    container: {
        width: '100%',
    maxWidth: '400px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow:
      '0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.06)',
    padding: '30px 40px',
    boxSizing: 'border-box',
    textAlign: 'center',
    },
    title: {
    marginBottom: '25px',
    color: '#333',
    fontWeight: '700',
    fontSize: '28px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  input: {
    padding: '14px 15px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1.5px solid #ddd',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    fontFamily: 'inherit',
  },
  button: {
    padding: '14px',
    backgroundColor: '#5a67d8',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    fontFamily: 'inherit',
  },
  error: {
    color: '#e53e3e',
    fontSize: '14px',
    fontWeight: '600',
  },
};
export default Register;