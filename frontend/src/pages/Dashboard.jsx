import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [showQuizOptions, setShowQuizOptions] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user')) || {};

  const handleStartQuiz = () => {
    setShowQuizOptions(true); 
  };

  const handleQuizSelection = (quizType) => {
    setShowQuizOptions(false); 
    navigate(`/quiz/${quizType}`); 
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={styles.pageContainer}>
      {/* Logout button */}
      <button
        onClick={handleLogout}
        style={styles.logoutButton}
        onMouseEnter={(e) => (e.target.style.backgroundColor = '#c0392b')}
        onMouseLeave={(e) => (e.target.style.backgroundColor = '#e74c3c')}
      >
        Logout
      </button>

      {/* Welcome Section */}
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome back, {user.name || 'User'}!</h2>
        <p style={styles.message}>
          Ready to challenge yourself? Click below to start the quiz and test your knowledge!
        </p>
        <button
          onClick={handleStartQuiz}
          style={styles.button}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#0056b3')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#007bff')}
        >
          Start Quiz
        </button>
      </div>

      {/* Modal for selecting quiz type */}
      {showQuizOptions && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Choose Quiz Type</h3>
            <button
              onClick={() => handleQuizSelection('20')}
              style={styles.modalButton}
            >
              20-Random Question Quiz
            </button>
            <button
              onClick={() => handleQuizSelection('30')}
              style={styles.modalButton}
            >
              30-Random Question Quiz
            </button>
            <button
              onClick={() => handleQuizSelection('subject')}
              style={styles.modalButton}
            >
              Subject-wise Quiz
            </button>
            <button
              onClick={() => setShowQuizOptions(false)}
              style={styles.closeButton}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  pageContainer: {
    minHeight: '90vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    position: 'relative', // Needed for absolute positioning of logout button
  },
  logoutButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#e74c3c',
    border: 'none',
    color: '#fff',
    padding: '10px 20px',
    fontSize: '14px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    boxShadow: '0 4px 6px rgba(231, 76, 60, 0.4)',
    transition: 'background-color 0.3s ease',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px 30px',
    maxWidth: '450px',
    width: '100%',
    borderRadius: '15px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
    textAlign: 'center',
    marginBottom: '20px',
  },
  title: {
    marginBottom: '10px',
    fontWeight: '700',
    fontSize: '28px',
    color: '#333',
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
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '40px',
    width: '300px',
    borderRadius: '10px',
    textAlign: 'center',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
  },
  modalTitle: {
    fontSize: '22px',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#333',
  },
  modalButton: {
    backgroundColor: '#007bff',
    border: 'none',
    color: '#fff',
    padding: '12px 24px',
    fontSize: '16px',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    fontWeight: '600',
    margin: '10px 0',
    width: '100%',
  },
  closeButton: {
    backgroundColor: '#f44336',
    border: 'none',
    color: '#fff',
    padding: '12px 24px',
    fontSize: '16px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '600',
    marginTop: '20px',
    width: '100%',
  },
};

export default Dashboard;
