import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatWidget from "../components/ChatWidget";
import axios from 'axios';
import studentAPI from "../services/studentAPI";
import { 
  Shield, 
  LogOut, 
  Play, 
  Target, 
  Activity, 
  Clock, 
  ChevronRight, 
  BookOpen, 
  User, 
  FileText, 
  X
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const [availableExams, setAvailableExams] = useState([]);
  const [showQuizOptions, setShowQuizOptions] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
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

  useEffect(() => {
    const fetchPublishedExams = async () => {
      try {
        const res = await studentAPI.getPublishedExams();
        setAvailableExams(res.data.exams);
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchPublishedExams();
  }, []);

  /* ================= UTILS ================= */
  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const openResultAnalysis = (attempt) => {
    navigate(`/result-analysis/${attempt._id}`);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <>
      {/* Global styles for hover effects and animations */}
      <style>{`
        body { margin: 0; background: #F8FAFC; font-family: 'Inter', sans-serif; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        .animate-slide-up { animation: slideUp 0.3s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition: all 0.25s ease;
        }
        
        .btn-primary { transition: all 0.2s ease; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2); background: #1D4ED8 !important; }
        
        .recent-row { transition: all 0.2s ease; border-bottom: 1px solid #F1F5F9; }
        .recent-row:hover { background: #F8FAFC; padding-left: 8px; }
        
        .exam-card { transition: all 0.2s ease; border: 1px solid #E2E8F0; }
        .exam-card:hover { border-color: #BFDBFE; box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.1); transform: translateY(-2px); }

        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
      `}</style>

      <div style={styles.page} className="animate-fade-in">
        
        {/* ===== TOP BAR ===== */}
        <header style={styles.topBar}>
          <div style={styles.brandContainer}>
            <Shield size={24} color="#2563EB" />
            <h2 style={styles.brand}>ExamSecure</h2>
          </div>
          <div style={styles.topBarRight}>
            <div style={styles.userInfo}>
              <div style={styles.avatar}>{user.name ? user.name.charAt(0).toUpperCase() : 'A'}</div>
              <span style={styles.userName}>{user.name || 'Aspirant'}</span>
            </div>
            <div style={styles.divider}></div>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </header>

        <main style={styles.container}>
          {/* ===== WELCOME HERO ===== */}
          <div style={styles.welcomeCard} className="glass-card">
            <div style={styles.welcomeContent}>
              <h1 style={styles.welcomeTitle}>
                {getGreeting()}, {user.name ? user.name.split(' ')[0] : 'Aspirant'}
              </h1>
              <p style={styles.welcomeText}>
                You are currently in a secure, distraction-free environment. Ready to start your next assessment?
              </p>
            </div>
            <button
              onClick={() => setShowQuizOptions(true)}
              style={styles.primaryBtn}
              className="btn-primary"
            >
              <Play size={18} fill="currentColor" /> Attempt Exam
            </button>
          </div>

          {/* ===== STATS GRID ===== */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard} className="glass-card">
              <div style={styles.statHeader}>
                <p style={styles.statLabel}>TOTAL ATTEMPTS</p>
                <div style={{...styles.statIcon, background: '#EFF6FF', color: '#2563EB'}}><Activity size={18} /></div>
              </div>
              <h3 style={styles.statValue}>{stats.totalAttempts}</h3>
            </div>
    
            <div style={styles.statCard} className="glass-card">
              <div style={styles.statHeader}>
                <p style={styles.statLabel}>AVERAGE ACCURACY</p>
                <div style={{...styles.statIcon, background: '#ECFDF5', color: '#10B981'}}><Target size={18} /></div>
              </div>
              <h3 style={styles.statValue}>{stats.avgAccuracy}%</h3>
            </div>

            <div style={styles.statCard} className="glass-card">
              <div style={styles.statHeader}>
                <p style={styles.statLabel}>RECENT EXAMS</p>
                <div style={{...styles.statIcon, background: '#F5F3FF', color: '#8B5CF6'}}><Clock size={18} /></div>
              </div>
              <h3 style={styles.statValue}>{stats.recent.length}</h3>
            </div>
          </div>

          {/* ===== RECENT ACTIVITY ===== */}
          <div style={styles.recentBox} className="glass-card">
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Recent Activity</h3>
            </div>

            {stats.recent.length === 0 ? (
              <div style={styles.emptyState}>
                <p style={styles.muted}>You haven't attempted any exams yet.</p>
              </div>
            ) : (
              <div style={styles.recentList}>
                {stats.recent.map((r, i) => (
                  <div
                    key={i}
                    style={styles.recentItem}
                    className="recent-row"
                    onClick={() => openResultAnalysis(r)}
                  >
                    <div style={styles.recentLeft}>
                      <div style={styles.recentIcon}><FileText size={16} /></div>
                      <div>
                        <p style={styles.recentExamTitle}>{r.quizType}</p>
                        <p style={styles.recentExamDate}>{new Date(r.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div style={styles.recentRight}>
                      <div style={styles.scoreBlock}>
                        <span style={styles.scoreText}>{r.score}/{r.totalQuestions}</span>
                        <span style={styles.accuracyBadge}>{r.accuracy}% Accuracy</span>
                      </div>
                      <ChevronRight size={18} color="#94A3B8" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* ===== FOOTER ===== */}
        <footer style={styles.footer}>
          <div style={styles.footerContent}>
            <div style={styles.footerBrandBlock}>
              <Shield size={18} color="#64748B" />
              <span style={styles.footerBrand}>ExamSecure</span>
            </div>
            <div style={styles.footerCopy}>
              © {new Date().getFullYear()} ExamSecure. All rights reserved.
            </div>
          </div>
        </footer>

        {/* ===== QUIZ MODAL ===== */}
        {showQuizOptions && (
          <div style={styles.modalOverlay} onClick={() => setShowQuizOptions(false)}>
            <div style={styles.examModal} className="animate-slide-up" onClick={(e) => e.stopPropagation()}>
              
              {/* Modal Header */}
              <div style={styles.modalHeader}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <BookOpen size={20} color="#2563EB" />
                    <h2 style={styles.modalTitle}>Available Assessments</h2>
                  </div>
                  <p style={styles.modalSubtitle}>Select an exam published by your instructor to begin your attempt.</p>
                </div>
                <button style={styles.closeBtn} onClick={() => setShowQuizOptions(false)}>
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body / Exam Grid */}
              <div style={styles.examGrid}>
                {availableExams.length === 0 ? (
                  <div style={styles.emptyExamsState}>
                    <div style={styles.emptyIconCircle}>
                      <FileText size={24} color="#94A3B8" />
                    </div>
                    <h4 style={{ margin: '0 0 4px 0', color: '#0F172A', fontSize: 15 }}>No Exams Published</h4>
                    <p style={{ margin: 0, color: '#64748B', fontSize: 13 }}>
                      There are currently no active exams assigned to your profile.
                    </p>
                  </div>
                ) : (
                  availableExams.map((exam) => {
                    const teacherDisplay =
                      typeof exam.teacher === "object" && exam.teacher?.name
                        ? exam.teacher.name
                        : typeof exam.createdBy === "object" && exam.createdBy?.name
                        ? exam.createdBy.name
                        : exam.teacherName || exam.teacher || "Instructor";

                    return (
                      <div key={exam._id} style={styles.examCard} className="exam-card">
                        {/* Header: Title & Tag */}
                        <div style={styles.examCardTop}>
                          <span style={styles.subjectTag}>{exam.subject || "General"}</span>
                          <span style={{
                            ...styles.difficultyBadge,
                            background: exam.difficulty === "Hard" ? "#FEF2F2" : exam.difficulty === "Easy" ? "#ECFDF5" : "#EFF6FF",
                            color: exam.difficulty === "Hard" ? "#DC2626" : exam.difficulty === "Easy" ? "#059669" : "#2563EB",
                            border: `1px solid ${exam.difficulty === "Hard" ? "#FCA5A5" : exam.difficulty === "Easy" ? "#A7F3D0" : "#BFDBFE"}`
                          }}>
                            {exam.difficulty || "Medium"}
                          </span>
                        </div>

                        <h3 style={styles.examTitle}>{exam.title || "Untitled Exam"}</h3>

                        {/* Meta Info */}
                        <div style={styles.examMetaRow}>
                          <div style={styles.teacherInfo}>
                            <User size={13} color="#64748B" />
                            <span>{teacherDisplay}</span>
                          </div>
                        </div>

                        {/* Footer Chips */}
                        <div style={styles.examMetricsRow}>
                          <span style={styles.metricChip}>
                            <FileText size={13} color="#475569" />
                            {exam.questions?.length || exam.totalQuestions || 0} Questions
                          </span>
                          <span style={styles.metricChip}>
                            <Clock size={13} color="#475569" />
                            {exam.duration || 60} Mins
                          </span>
                        </div>

                        {/* Button */}
                        <button
                          style={styles.startExamBtn}
                          className="btn-primary"
                          onClick={() => {
                              setShowQuizOptions(false);
                              navigate(`/exam/${exam._id}/instructions`);
                          }}
                        >
                          <span>Start Assessment</span>
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
        
        <ChatWidget />
        {/* ===== LOGOUT CONFIRMATION MODAL ===== */}
        {showLogoutModal && (
          <div style={styles.modalOverlay} onClick={() => setShowLogoutModal(false)}>
            <div style={styles.logoutModalCard} className="animate-slide-up" onClick={(e) => e.stopPropagation()}>
              <div style={styles.logoutIconWrapper}>
                <LogOut size={22} color="#DC2626" />
              </div>
              <h3 style={styles.logoutModalTitle}>Sign out of your account?</h3>
              <p style={styles.logoutModalText}>
                You will need to enter your credentials again to access your secure student dashboard.
              </p>
              <div style={styles.logoutModalActions}>
                <button 
                  style={styles.modalCancelBtn} 
                  onClick={() => setShowLogoutModal(false)}
                >
                  Cancel
                </button>
                <button 
                  style={styles.modalConfirmBtn} 
                  onClick={confirmLogout}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: '100vh',
    background: '#F8FAFC',
    display: 'flex',
    flexDirection: 'column',
  },

  // Header
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 40px',
    background: 'rgba(255,255,255,0.8)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid #E2E8F0',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  brandContainer: { display: 'flex', alignItems: 'center', gap: 10 },
  brand: { margin: 0, fontSize: 20, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em' },
  topBarRight: { display: 'flex', alignItems: 'center', gap: 20 },
  userInfo: { display: 'flex', alignItems: 'center', gap: 10 },
  avatar: { width: 32, height: 32, borderRadius: '50%', background: '#F1F5F9', color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 13, border: '1px solid #E2E8F0' },
  userName: { fontSize: 14, fontWeight: 500, color: '#0F172A' },
  divider: { width: 1, height: 24, background: '#E2E8F0' },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', color: '#64748B', border: 'none', padding: '8px 12px', borderRadius: 8, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' },

  container: {
    maxWidth: 1100,
    margin: '40px auto',
    padding: '0 24px',
    flex: 1,
    width: '100%',
    boxSizing: 'border-box'
  },

  // Welcome Hero
  welcomeCard: {
    padding: '40px',
    borderRadius: 20,
    border: '1px solid #E2E8F0',
    boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 20px rgba(0,0,0,0.02)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 24,
  },
  welcomeContent: { flex: 1, minWidth: 300 },
  welcomeTitle: { margin: '0 0 10px 0', fontSize: 28, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em' },
  welcomeText: { margin: 0, color: '#64748B', fontSize: 15, lineHeight: 1.5 },
  primaryBtn: { display: 'flex', alignItems: 'center', gap: 8, background: '#2563EB', color: '#fff', border: 'none', padding: '14px 28px', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer' },

  // Stats Grid
  statsGrid: {
    marginTop: 32,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 24,
  },
  statCard: {
    padding: '24px',
    borderRadius: 16,
    border: '1px solid #E2E8F0',
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
  },
  statHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  statLabel: { margin: 0, fontSize: 12, fontWeight: 600, color: '#64748B', letterSpacing: '0.05em' },
  statIcon: { padding: 8, borderRadius: 10, display: 'flex' },
  statValue: { margin: 0, fontSize: 32, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.03em' },

  // Recent Activity
  recentBox: {
    marginTop: 32,
    padding: '32px',
    borderRadius: 20,
    border: '1px solid #E2E8F0',
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
  },
  sectionHeader: { marginBottom: 24 },
  sectionTitle: { margin: 0, fontSize: 18, fontWeight: 700, color: '#0F172A' },
  emptyState: { padding: '40px 0', textAlign: 'center' },
  muted: { color: '#64748B', fontSize: 14 },
  recentList: { display: 'flex', flexDirection: 'column' },
  recentItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', cursor: 'pointer' },
  recentLeft: { display: 'flex', alignItems: 'center', gap: 16 },
  recentIcon: { background: '#F1F5F9', color: '#64748B', padding: 10, borderRadius: 10, display: 'flex' },
  recentExamTitle: { margin: '0 0 4px 0', fontSize: 15, fontWeight: 600, color: '#0F172A' },
  recentExamDate: { margin: 0, fontSize: 13, color: '#64748B' },
  recentRight: { display: 'flex', alignItems: 'center', gap: 16 },
  scoreBlock: { textAlign: 'right' },
  scoreText: { display: 'block', margin: '0 0 4px 0', fontSize: 15, fontWeight: 600, color: '#0F172A' },
  accuracyBadge: { display: 'inline-block', background: '#ECFDF5', color: '#10B981', padding: '2px 8px', borderRadius: 999, fontSize: 12, fontWeight: 600 },

  // Modal Overlay & Window
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 23, 42, 0.5)',
    backdropFilter: 'blur(6px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  examModal: {
    background: "#FFFFFF",
    width: "100%",
    maxWidth: 880,
    maxHeight: "85vh",
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 20,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    border: '1px solid #E2E8F0',
    overflow: 'hidden'
  },
  modalHeader: {
    padding: '24px 28px',
    borderBottom: '1px solid #F1F5F9',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    background: '#FAFAFA'
  },
  modalTitle: { margin: 0, fontSize: 20, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em' },
  modalSubtitle: { margin: '4px 0 0 0', color: '#64748B', fontSize: 13 },
  closeBtn: { background: '#FFFFFF', border: '1px solid #E2E8F0', color: '#64748B', padding: 6, borderRadius: 8, cursor: 'pointer', display: 'flex', transition: 'all 0.2s' },

  // Exam Grid
  examGrid: {
    padding: '28px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: 20,
    overflowY: 'auto',
    background: '#F8FAFC'
  },
  
  // Individual Exam Card
  examCard: {
    background: '#FFFFFF',
    borderRadius: 14,
    padding: '20px',
    border: '1px solid #E2E8F0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 16,
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
  },
  examCardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  subjectTag: {
    fontSize: 11,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#64748B',
    background: '#F1F5F9',
    padding: '3px 8px',
    borderRadius: 6
  },
  difficultyBadge: {
    fontSize: 11,
    fontWeight: 600,
    padding: '2px 8px',
    borderRadius: 999
  },
  examTitle: {
    margin: 0,
    fontSize: 16,
    fontWeight: 600,
    color: '#0F172A',
    lineHeight: 1.35
  },
  examMetaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12
  },
  teacherInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 13,
    color: '#475569',
    fontWeight: 500
  },
  examMetricsRow: {
    display: 'flex',
    gap: 8,
    alignItems: 'center'
  },
  metricChip: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: '#F8FAFC',
    color: '#475569',
    padding: '6px 10px',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 500,
    border: '1px solid #E2E8F0'
  },
  startExamBtn: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    background: '#2563EB',
    color: '#FFFFFF',
    border: 'none',
    padding: '10px 16px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer'
  },
  emptyExamsState: {
    gridColumn: '1 / -1',
    padding: '60px 20px',
    textAlign: 'center',
    background: '#FFFFFF',
    borderRadius: 14,
    border: '1px solid #E2E8F0'
  },
  emptyIconCircle: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    background: '#F1F5F9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 12px auto'
  },
  // Footer
  footer: {
    marginTop: 'auto',
    borderTop: '1px solid #E2E8F0',
    padding: '24px 40px',
    background: '#FFFFFF'
  },
  footerContent: {
    maxWidth: 1100,
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerBrandBlock: { display: 'flex', alignItems: 'center', gap: 8 },
  footerBrand: { fontSize: 14, fontWeight: 600, color: '#475569' },
  footerCopy: { fontSize: 13, color: '#94A3B8' },
  // Logout Modal Styles
  logoutModalCard: {
    background: '#FFFFFF',
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: '32px',
    textAlign: 'center',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    border: '1px solid #E2E8F0',
  },
  logoutIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    background: '#FEF2F2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px auto',
    border: '1px solid #FECACA',
  },
  logoutModalTitle: {
    margin: '0 0 8px 0',
    fontSize: 18,
    fontWeight: 700,
    color: '#0F172A',
    letterSpacing: '-0.02em',
  },
  logoutModalText: {
    margin: '0 0 24px 0',
    fontSize: 13,
    color: '#64748B',
    lineHeight: 1.5,
  },
  logoutModalActions: {
    display: 'flex',
    gap: 12,
  },
  modalCancelBtn: {
    flex: 1,
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    color: '#475569',
    padding: '10px 16px',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  modalConfirmBtn: {
    flex: 1,
    background: '#DC2626',
    border: 'none',
    color: '#FFFFFF',
    padding: '10px 16px',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};

export default Dashboard;