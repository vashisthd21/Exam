import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import studentAPI from "../services/studentAPI";
import {
  BookOpen,
  User,
  HelpCircle,
  Clock,
  Target,
  Award,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  Loader2
} from "lucide-react";

const ExamInstructions = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [agree, setAgree] = useState(false);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await studentAPI.getExamById(id);
        setExam(res.data.exam);
      } catch (err) {
        console.error("Failed to fetch exam instructions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [id]);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Loader2 size={36} className="animate-spin" color="#2563EB" />
        <p style={{ color: '#64748B', fontWeight: 500, marginTop: 12 }}>Loading Assessment Instructions...</p>
      </div>
    );
  }

  if (!exam) {
    return (
      <div style={styles.loadingContainer}>
        <p style={{ color: '#0F172A', fontWeight: 600, fontSize: 18 }}>Exam not found or unavailable.</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        body { margin: 0; background: #F8FAFC; font-family: 'Inter', -apple-system, sans-serif; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(16px);
          border: 1px solid #E2E8F0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 12px 24px -4px rgba(0, 0, 0, 0.04);
          border-radius: 20px;
        }

        .btn-hover { transition: all 0.2s ease; }
        .btn-hover:not(:disabled):hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(37, 99, 235, 0.25); background: #1D4ED8 !important; }

        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 4px; }
      `}</style>

      <div style={styles.page} className="animate-fade-in">
        <div style={styles.card} className="glass-card">

          {/* Header */}
          <div style={styles.headerBlock}>
            <span style={styles.badgeTag}>Secure Assessment</span>
            <h1 style={styles.title}>{exam.title}</h1>
            <p style={styles.subtitle}>
              Please review the following configuration parameters and proctoring guidelines carefully before initializing your assessment.
            </p>
          </div>

          {/* Grid Stats */}
          <div style={styles.grid}>
            <div style={styles.infoBox}>
              <div style={{ ...styles.iconWrapper, background: '#EFF6FF', color: '#2563EB' }}>
                <BookOpen size={18} />
              </div>
              <div>
                <span style={styles.infoLabel}>Subject</span>
                <p style={styles.infoValue}>{exam.subject}</p>
              </div>
            </div>

            <div style={styles.infoBox}>
              <div style={{ ...styles.iconWrapper, background: '#F5F3FF', color: '#8B5CF6' }}>
                <User size={18} />
              </div>
              <div>
                <span style={styles.infoLabel}>Instructor</span>
                <p style={styles.infoValue}>{exam.teacher || "Authorized Faculty"}</p>
              </div>
            </div>

            <div style={styles.infoBox}>
              <div style={{ ...styles.iconWrapper, background: '#ECFDF5', color: '#10B981' }}>
                <HelpCircle size={18} />
              </div>
              <div>
                <span style={styles.infoLabel}>Total Questions</span>
                <p style={styles.infoValue}>{exam.totalQuestions} Questions</p>
              </div>
            </div>

            <div style={styles.infoBox}>
              <div style={{ ...styles.iconWrapper, background: '#FEF3C7', color: '#D97706' }}>
                <Clock size={18} />
              </div>
              <div>
                <span style={styles.infoLabel}>Time Duration</span>
                <p style={styles.infoValue}>{exam.duration} Minutes</p>
              </div>
            </div>

            <div style={styles.infoBox}>
              <div style={{ ...styles.iconWrapper, background: '#FEE2E2', color: '#DC2626' }}>
                <Target size={18} />
              </div>
              <div>
                <span style={styles.infoLabel}>Difficulty Tier</span>
                <p style={styles.infoValue}>{exam.difficulty}</p>
              </div>
            </div>

            <div style={styles.infoBox}>
              <div style={{ ...styles.iconWrapper, background: '#F1F5F9', color: '#475569' }}>
                <Award size={18} />
              </div>
              <div>
                <span style={styles.infoLabel}>Passing Marks</span>
                <p style={styles.infoValue}>{exam.passingMarks} Marks</p>
              </div>
            </div>
          </div>

          {/* Rules Section */}
          <div style={styles.rules}>
            <div style={styles.rulesHeader}>
              <ShieldAlert size={20} color="#B45309" />
              <h3 style={styles.rulesTitle}>Mandatory Examination Guidelines</h3>
            </div>
            <ul style={styles.rulesList}>
              <li style={styles.ruleItem}>Stay in <strong>full-screen mode</strong> at all times throughout the assessment window.</li>
              <li style={styles.ruleItem}>Do not attempt to refresh, minimize, or close the browser tab.</li>
              <li style={styles.ruleItem}>Switching application context or browser tabs will trigger automatic security violations.</li>
              <li style={styles.ruleItem}>Ensure your camera remains active for AI proctoring compliance.</li>
              <li style={styles.ruleItem}>The platform will auto-submit your terminal evaluation metrics when the allocated timer expires.</li>
              <li style={styles.ruleItem}>Verify your local network connection stability prior to starting.</li>
            </ul>
          </div>

          {/* Checkbox agreement */}
          <label style={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              style={styles.checkbox}
            />
            <span style={styles.checkboxText}>
              I have read, understood, and agree to abide by all the security rules and instructions specified above.
            </span>
          </label>

          {/* Action Button */}
          <button
            disabled={!agree}
            style={{
              ...styles.button,
              opacity: agree ? 1 : 0.5,
              cursor: agree ? "pointer" : "not-allowed",
            }}
            onClick={() => navigate(`/exam/${id}`)}
            className="btn-hover"
          >
            <span>Begin Assessment</span>
            <ArrowRight size={18} />
          </button>

        </div>
      </div>
    </>
  );
};

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#F8FAFC",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 20px",
  },

  card: {
    background: "#FFFFFF",
    width: "100%",
    maxWidth: 900,
    borderRadius: 20,
    padding: "40px 48px",
    border: "1px solid #E2E8F0",
    boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.05)",
  },

  headerBlock: {
    textAlign: "center",
    marginBottom: 32,
  },

  badgeTag: {
    display: "inline-block",
    background: "#EFF6FF",
    color: "#2563EB",
    border: "1px solid #BFDBFE",
    padding: "4px 12px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: 12,
  },

  title: {
    margin: "0 0 8px 0",
    fontSize: 28,
    fontWeight: 700,
    color: "#0F172A",
    letterSpacing: "-0.02em",
  },

  subtitle: {
    margin: 0,
    color: "#64748B",
    fontSize: 14,
    lineHeight: 1.5,
    maxWidth: 600,
    marginInline: "auto",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 16,
    marginBottom: 32,
  },

  infoBox: {
    background: "#F8FAFC",
    padding: "16px 20px",
    borderRadius: 14,
    border: "1px solid #E2E8F0",
    display: "flex",
    alignItems: "center",
    gap: 14,
  },

  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  infoLabel: {
    display: "block",
    fontSize: 11,
    fontWeight: 600,
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: 2,
  },

  infoValue: {
    margin: 0,
    fontSize: 15,
    fontWeight: 600,
    color: "#0F172A",
  },

  rules: {
    background: "#FFFBEB",
    border: "1px solid #FDE68A",
    padding: "24px 28px",
    borderRadius: 16,
    marginBottom: 28,
  },

  rulesHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },

  rulesTitle: {
    margin: 0,
    fontSize: 15,
    fontWeight: 700,
    color: "#92400E",
  },

  rulesList: {
    margin: 0,
    paddingLeft: 20,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },

  ruleItem: {
    fontSize: 13,
    color: "#78350F",
    lineHeight: 1.5,
  },

  checkboxRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    cursor: "pointer",
    padding: "4px 0",
  },

  checkbox: {
    width: 18,
    height: 18,
    marginTop: 2,
    accentColor: "#2563EB",
    cursor: "pointer",
  },

  checkboxText: {
    fontSize: 14,
    color: "#334155",
    fontWeight: 500,
    lineHeight: 1.4,
  },

  button: {
    marginTop: 24,
    width: "100%",
    background: "#2563EB",
    color: "#FFFFFF",
    border: "none",
    padding: "14px 24px",
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  loadingContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#F8FAFC",
  },
};

export default ExamInstructions;