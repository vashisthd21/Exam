import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  // Fetch user from localStorage (assuming you stored it as JSON string)
  const user = JSON.parse(localStorage.getItem('user')) || {};

  const handleStartQuiz = () => {
    navigate('/quiz');
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome back, {user.name || 'User'}!</h2>

        <p style={styles.message}>
          Ready to challenge yourself? Click below to start the quiz and test your knowledge!
        </p>

        <button
          onClick={handleStartQuiz}
          style={styles.button}
          onMouseEnter={e => (e.target.style.backgroundColor = '#0056b3')}
          onMouseLeave={e => (e.target.style.backgroundColor = '#007bff')}
        >
          Start Quiz
        </button>
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
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    backgroundColor: 'white',
    padding: '40px 30px',
    maxWidth: '450px',
    width: '100%',
    borderRadius: '15px',
    boxShadow:
      '0 10px 25px rgba(0, 0, 0, 0.15)',
    textAlign: 'center',
  },
  title: {
    marginBottom: '10px',
    fontWeight: '700',
    fontSize: '28px',
    color: '#333',
  },
  subtitle: {
    marginBottom: '30px',
    fontSize: '16px',
    color: '#555',
  },
  email: {
    fontWeight: '600',
    color: '#444',
  },
  message: {
    fontSize: '16px',
    marginBottom: '40px',
    color: '#666',
    lineHeight: '1.5',
  },
  button: {
    backgroundColor: '#007bff',
    border: 'none',
    color: '#fff',
    padding: '14px 28px',
    fontSize: '18px',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    fontWeight: '600',
  },
};

export default Dashboard;
