import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const API = import.meta.env.VITE_API_BASE_URL;
const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || {};

  const [showQuizOptions, setShowQuizOptions] = useState(false);
  const [stats, setStats] = useState({
    totalAttempts: 0,
    avgAccuracy: 0,
    recent: [],
  });

  /* ================= FETCH STATS ================= */
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `${API}/api/dashboard/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load dashboard stats');
      }
    };

    fetchStats();
  }, []);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    if (!window.confirm('Are you sure you want to logout?')) return;
    localStorage.clear();
    navigate('/');
  };

  const handleQuizSelection = (type) => {
    setShowQuizOptions(false);
    navigate(`/quiz/${type}`);
  };

  // const openResultAnalysis = (attempt) => {
  //   navigate('/result', {
  //     state: {
  //       score: attempt.score,
  //       totalQuestions: attempt.totalQuestions,
  //       accuracy: attempt.accuracy,
  //       quizType: attempt.quizType,
  //       timeTaken: attempt.timeTaken,
  //       createdAt: attempt.createdAt,
  //     },
  //   });
  // };
  const openResultAnalysis = (attempt) => {
  navigate(`/result-analysis/${attempt._id}`);
};

  return (
    <div style={styles.page}>
      {/* ===== TOP BAR ===== */}
      <div style={styles.topBar}>
        <h2 style={styles.brand}>ExamSecure</h2>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          ⏻ Logout
        </button>
      </div>

      {/* ===== MAIN ===== */}
      <div style={styles.container}>
        {/* WELCOME */}
        <div style={styles.welcomeCard}>
          <h1 style={styles.welcomeTitle}>
            Welcome back, {user.name || 'Aspirant'} 👋
          </h1>
          <p style={styles.welcomeText}>
            Practice in a distraction-free, secure exam environment.
          </p>

          <button
            onClick={() => setShowQuizOptions(true)}
            style={styles.primaryBtn}
          >
            Start New Exam
          </button>
        </div>

        {/* ===== STATS ===== */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <h3>📊 {stats.totalAttempts}</h3>
            <p>Total Attempts</p>
          </div>
  
          <div style={styles.statCard}>
            <h3>{stats.avgAccuracy}%</h3>
            <p>Average Accuracy</p>
          </div>

          <div style={styles.statCard}>
            <h3>{stats.recent.length}</h3>
            <p>Recent Exams</p>
          </div>
        </div>

        {/* ===== RECENT ACTIVITY ===== */}
        <div style={styles.recentBox}>
          <h3 style={styles.sectionTitle}>Recent Activity</h3>

          {stats.recent.length === 0 ? (
            <p style={styles.muted}>No attempts yet</p>
          ) : (
            stats.recent.map((r, i) => (
              <div
                key={i}
                style={styles.recentItem}
                onClick={() => openResultAnalysis(r)}
              >
                <span>{r.quizType}</span>
                <strong>
                  {r.score}/{r.totalQuestions}
                </strong>
                <span>{r.accuracy}%</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ===== QUIZ MODAL ===== */}
      {showQuizOptions && (
        <div style={styles.modalOverlay}>
          <div style={styles.examModal}>
            <h2 style={styles.modalTitle}>Choose Exam Format</h2>
            <p style={styles.modalSubtitle}>
              Select a test based on your preparation goal
            </p>

            <div style={styles.examGrid}>
              <div
                style={{ ...styles.examCard, borderTop: '4px solid #2563eb' }}
                onClick={() => handleQuizSelection('20')}
              >
                <div style={styles.examIcon}>⚡</div>
                <h4>Quick Test</h4>
                <p>20 Random Questions</p>
                <span>⏱ 20 mins</span>
              </div>

              <div
                style={{ ...styles.examCard, borderTop: '4px solid #16a34a' }}
                onClick={() => handleQuizSelection('30')}
              >
                <div style={styles.examIcon}>🧠</div>
                <h4>Full Practice</h4>
                <p>30 Random Questions</p>
                <span>🔥 Moderate</span>
              </div>

              <div
                style={{ ...styles.examCard, borderTop: '4px solid #9333ea' }}
                onClick={() => handleQuizSelection('subject')}
              >
                <div style={styles.examIcon}>📚</div>
                <h4>Subject-wise</h4>
                <p>Polity • Economy • History</p>
                <span>🎯 Deep Focus</span>
              </div>
            </div>

            <button
              style={styles.cancelBtn}
              onClick={() => setShowQuizOptions(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ===== FOOTER ===== */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div>
            <h4 style={styles.footerBrand}>ExamSecure</h4>
            <p style={styles.footerText}>
              Secure • Fair • Exam-focused
            </p>
          </div>

          <div style={styles.footerLinks}>
            <span>About</span>
            <span>Privacy</span>
            <span>Terms</span>
            <span>Support</span>
          </div>

          <div style={styles.footerCopy}>
            © {new Date().getFullYear()} ExamSecure. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg,#0b3a82,#eaf1ff)',
    fontFamily: "'Inter', sans-serif",
  },

  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 32px',
    color: '#fff',
  },

  brand: {
    fontSize: 26,
    fontWeight: 800,
  },

  logoutBtn: {
    background: '#ef4444',
    color: '#fff',
    border: 'none',
    padding: '10px 18px',
    borderRadius: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },
  // logoutBtn::hover{
  //   cursor: pointer;
  // },
  container: {
    maxWidth: 1100,
    margin: '40px auto',
    padding: '0 20px',
  },

  welcomeCard: {
    background: '#fff',
    padding: '32px',
    borderRadius: 22,
    boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
    textAlign: 'center',
  },

  welcomeTitle: {
    fontSize: 34,
    fontWeight: 800,
  },

  welcomeText: {
    color: '#64748b',
    margin: '10px 0 20px',
  },

  primaryBtn: {
    background: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
    boxShadow: '0 10px 25px rgba(37,99,235,0.4)',
    outline: 'none',
    outlineOffset: 2,
    color: '#fff',
    border: 'none',
    padding: '16px 38px',
    borderRadius: 16,
    fontSize: 18,
    fontWeight: 700,
    cursor: 'pointer',
  },

  statsGrid: {
    marginTop: 45,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
    gap: 22,
  },

  statCard: {
    background: '#fff',
    padding: '30px',
    borderRadius: 18,
    textAlign: 'center',
    boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
  },

  recentBox: {
    marginTop: 50,
    background: '#fff',
    padding: 30,
    borderRadius: 18,
    boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 20,
  },

  recentItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid #e5e7eb',
    cursor: 'pointer',
    transition: 'background 0.2s, padding-left 0.2s',
  },

  muted: {
    color: '#64748b',
  },

  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.55)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },

  examModal: {
    background: '#ffffff',
    width: '90%',
    maxWidth: 900,
    padding: '40px',
    borderRadius: 24,
    textAlign: 'center',
    animation: 'popIn 0.25s ease-out',
    boxShadow: '0 30px 80px rgba(0,0,0,0.35)',
  },

  modalTitle: {
    fontSize: 28,
    fontWeight: 800,
    color: '#0f172a',
  },

  modalSubtitle: {
    color: '#64748b',
    marginBottom: 35,
  },

  examGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 24,
  },

  examCard: {
    background: 'linear-gradient(180deg,#f8fafc,#eef2ff)',
    borderRadius: 20,
    padding: '28px 22px',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
  },

  examIcon: {
    fontSize: 34,
    marginBottom: 12,
  },

  cancelBtn: {
    marginTop: 30,
    background: '#e5e7eb',
    border: 'none',
    padding: '14px 32px',
    borderRadius: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },

  footer: {
    marginTop: 80,
    background: '#020617',
    color: '#cbd5f5',
    padding: '30px 20px',
  },

  footerContent: {
    maxWidth: 1100,
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 20,
  },

  footerBrand: {
    fontSize: 20,
    fontWeight: 800,
    color: '#fff',
  },

  footerText: {
    fontSize: 14,
    color: '#94a3b8',
  },

  footerLinks: {
    display: 'flex',
    gap: 20,
    fontSize: 14,
    cursor: 'pointer',
  },

  footerCopy: {
    fontSize: 13,
    color: '#94a3b8',
  },
};

export default Dashboard;
