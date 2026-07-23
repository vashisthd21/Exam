import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowLeft,
  BarChart2,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  BookOpen,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  Brain,
  Search,
  Zap,
  HelpCircle,
  PieChart as PieChartIcon
} from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL;

const questionVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

const ResultAnalysis = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [showGraph, setShowGraph] = useState(false);
  const [data, setData] = useState(null);
  const [current, setCurrent] = useState(0);
  const [aiExplanation, setAiExplanation] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [thinkingStage, setThinkingStage] = useState("");

  const explainWithAI = async (q, studentAnswerIndex) => {
    try {
      setLoadingAI(true);
      setShowModal(true);
      setAiExplanation("");
      setThinkingStage("thinking");

      const token = localStorage.getItem("token");
      setTimeout(() => {
        setThinkingStage("analyzing");
      }, 600);

      const res = await axios.post(
        `${API}/api/chat`,
        {
          message: `
You are an expert mentor.

Your task is to explain the following multiple-choice question clearly.

Follow this STRICT structure:

### 1. Concept
- Explain the core concept in 2–3 lines.

### 2. Correct Answer Explanation
- Clearly explain WHY the correct answer is right.

### 3. Why Other Options Are Wrong
- Briefly explain why each incorrect option is wrong.

### 4. Key Facts / Features
- List important points or facts related to the topic.

### 5. Exam Tip
- Add a short trick or tip useful for students.

Rules:
- Use bullet points
- Keep it concise
- Use simple language
- Be exam-oriented

---

Question:
${q.question}

Options:
${q.options.map((o, i) => `${i + 1}. ${o}`).join("\n")}

Correct Answer:
${q.options[q.answer]}

User Answer:
${studentAnswerIndex !== undefined && studentAnswerIndex >= 0 ? q.options[studentAnswerIndex] : "Not Answered"}
          `,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setThinkingStage("generating");

      setTimeout(() => {
        setAiExplanation(res.data.reply);
        setThinkingStage("done");
        setLoadingAI(false);
      }, 800);
    } catch (err) {
      setAiExplanation("Unable to generate AI explanation. Please try again.");
      setThinkingStage("done");
      setLoadingAI(false);
    }
  };

  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        const token = localStorage.getItem("token");
        // Updated to use your student exam attempt route endpoint
        const res = await axios.get(
          `${API}/api/quiz/student/attempt/${attemptId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setData(res.data.attempt);
      } catch (err) {
        console.error("Failed to load attempt analysis", err);
      }
    };
    fetchAttempt();
  }, [attemptId]);

  if (!data) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={{ color: '#64748B', fontWeight: 500 }}>Loading Analysis Report...</p>
      </div>
    );
  }

  // Map answers to match question structure cleanly for rendering
  const formattedAnalysis = data.answers.map((ans) => {
    const qObj = ans.questionId || {};
    return {
      questionId: qObj._id,
      question: qObj.question || "Question content unavailable",
      options: qObj.options || [],
      correctAnswer: qObj.answer, // Assumes Question model stores correct index as 'answer'
      userAnswer: ans.selectedOption,
      isCorrect: ans.isCorrect,
      explanation: qObj.explanation,
      subject: qObj.subject || data.exam?.subject || "General",
      year: qObj.year,
    };
  });

  const q = formattedAnalysis[current];

  /* ========= SUBJECT BAR DATA ========= */
  const subjectMap = {};
  formattedAnalysis.forEach((item) => {
    if (!subjectMap[item.subject]) {
      subjectMap[item.subject] = { correct: 0, total: 0 };
    }
    subjectMap[item.subject].total++;
    if (item.isCorrect) {
      subjectMap[item.subject].correct++;
    }
  });

  const subjectData = Object.keys(subjectMap).map((subject) => ({
    subject,
    accuracy: Math.round(
      (subjectMap[subject].correct / subjectMap[subject].total) * 100
    ),
  }));

  const accuracyPercentage = data.accuracy || Math.round((data.score / data.totalQuestions) * 100) || 0;

  return (
    <>
      <style>{`
        body { margin: 0; background: #F8FAFC; font-family: 'Inter', -apple-system, sans-serif; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          border: 1px solid #E2E8F0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02), 0 8px 16px rgba(0,0,0,0.02);
          border-radius: 18px;
        }

        .btn-hover { transition: all 0.2s ease; }
        .btn-hover:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15); }
        
        .ai-btn-hover { transition: all 0.2s ease; }
        .ai-btn-hover:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(147, 51, 234, 0.25); background: #7E22CE !important; }

        .palette-btn { transition: all 0.2s ease; }
        .palette-btn:hover { transform: scale(1.08); }

        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
      `}</style>

      <div style={styles.page} className="animate-fade-in">
        
        {/* TOP BAR */}
        <header style={styles.topHeader}>
          <button
            style={styles.dashboardBtn}
            onClick={() => navigate("/dashboard")}
            className="btn-hover"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          
          <div style={styles.headerTitleBlock}>
            <h1 style={styles.heading}>Exam Performance Analysis</h1>
            <p style={styles.subHeading}>{data.exam?.title || "Assessment Evaluation"}</p>
          </div>

          <div style={{ width: 140 }}></div>
        </header>

        {/* MAIN LAYOUT */}
        <div style={styles.layout}>
          
          {/* ================= LEFT SIDEBAR ================= */}
          <div style={styles.left}>
            
            {/* SCORE CARD */}
            <div className="glass-card" style={styles.cardPadding}>
              <div style={styles.cardHeader}>
                <PieChartIcon size={18} color="#2563EB" />
                <h4 style={styles.cardTitle}>Score Overview</h4>
              </div>

              <div style={styles.scoreRow}>
                <div style={styles.scoreMetric}>
                  <span style={styles.scoreLabel}>Final Score</span>
                  <p style={styles.scoreBig}>{data.score} <span style={{fontSize: 16, color: '#94A3B8', fontWeight: 500}}>/ {data.totalQuestions}</span></p>
                </div>
                <div style={styles.accuracyBadgeBlock}>
                  <span style={{
                    ...styles.accuracyBadge,
                    background: accuracyPercentage >= 60 ? '#ECFDF5' : '#FEF2F2',
                    color: accuracyPercentage >= 60 ? '#059669' : '#DC2626',
                    border: `1px solid ${accuracyPercentage >= 60 ? '#A7F3D0' : '#FECACA'}`
                  }}>
                    {accuracyPercentage}% Accuracy
                  </span>
                </div>
              </div>

              <div style={styles.metaDetails}>
                <div style={styles.metaItem}>
                  <Clock size={14} color="#64748B" />
                  <span>Time Taken: <strong>{Math.floor(data.timeTaken / 60)}m {Math.floor(data.timeTaken % 60)}s</strong></span>
                </div>
                <div style={styles.metaItem}>
                  <Calendar size={14} color="#64748B" />
                  <span>Submitted: {new Date(data.createdAt || data.submittedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* QUESTION PALETTE */}
            <div className="glass-card" style={styles.cardPadding}>
              <div style={styles.cardHeader}>
                <BookOpen size={18} color="#64748B" />
                <h4 style={styles.cardTitle}>Question Palette</h4>
              </div>

              <div style={styles.trackerGrid}>
                {formattedAnalysis.map((item, i) => {
                  const isCurrent = i === current;
                  const isCorrect = item.isCorrect;

                  return (
                    <button
                      key={i}
                      className="palette-btn"
                      onClick={() => i !== current && setCurrent(i)}
                      style={{
                        ...styles.trackBtn,
                        background: isCurrent
                          ? "#2563EB"
                          : isCorrect
                          ? "#10B981"
                          : "#EF4444",
                        color: "#FFFFFF",
                        boxShadow: isCurrent ? "0 0 0 3px #BFDBFE" : "none"
                      }}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>

              <div style={styles.legend}>
                <div style={styles.legendItem}><span style={{...styles.dot, background: '#2563EB'}}></span> Selected</div>
                <div style={styles.legendItem}><span style={{...styles.dot, background: '#10B981'}}></span> Correct</div>
                <div style={styles.legendItem}><span style={{...styles.dot, background: '#EF4444'}}></span> Incorrect</div>
              </div>
            </div>

            {/* GRAPH TOGGLE BUTTON */}
            <button
              onClick={() => setShowGraph((prev) => !prev)}
              style={styles.graphToggleBtn}
              className="btn-hover"
            >
              <BarChart2 size={16} />
              {showGraph ? "Hide Subject Breakdown" : "View Subject Breakdown"}
            </button>
          </div>

          {/* ================= RIGHT PANEL ================= */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                variants={questionVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="glass-card"
                style={styles.rightCardPadding}
              >
                {/* QUESTION META */}
                <div style={styles.metaRow}>
                  <span style={styles.subjectBadge}>{q.subject}</span>
                  {q.year && <span style={styles.yearBadge}>{q.year}</span>}
                  <span style={styles.qIndex}>
                    Question {current + 1} of {formattedAnalysis.length}
                  </span>
                </div>

                <h2 style={styles.questionText}>{q.question}</h2>

                {/* OPTIONS LIST */}
                <div style={styles.optionsList}>
                  {q.options.map((opt, i) => {
                    const isCorrect = i === q.correctAnswer;
                    const isUser = i === q.userAnswer;

                    return (
                      <div
                        key={i}
                        style={{
                          ...styles.optionCard,
                          borderColor: isCorrect
                            ? "#10B981"
                            : isUser
                            ? "#EF4444"
                            : "#E2E8F0",
                          background: isCorrect
                            ? "#ECFDF5"
                            : isUser
                            ? "#FEF2F2"
                            : "#FFFFFF",
                        }}
                      >
                        <div style={styles.optionLeft}>
                          <span style={{
                            ...styles.optionIndex,
                            background: isCorrect ? '#10B981' : isUser ? '#EF4444' : '#F1F5F9',
                            color: (isCorrect || isUser) ? '#FFFFFF' : '#475569'
                          }}>
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span style={styles.optionText}>{opt}</span>
                        </div>

                        {isCorrect && (
                          <span style={styles.correctTag}>
                            <CheckCircle2 size={16} /> Correct Answer
                          </span>
                        )}
                        {isUser && !isCorrect && (
                          <span style={styles.wrongTag}>
                            <XCircle size={16} /> Your Answer
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* EXPLANATION */}
                {q.explanation && (
                  <div style={styles.explanationBox}>
                    <div style={styles.explanationHeader}>
                      <HelpCircle size={16} color="#2563EB" />
                      <strong>Standard Explanation:</strong>
                    </div>
                    <p style={styles.explanationBody}>{q.explanation}</p>
                  </div>
                )}

                {/* AI EXPLANATION TRIGGER */}
                <button
                  onClick={() => explainWithAI(q, q.userAnswer)}
                  style={styles.aiBtn}
                  className="ai-btn-hover"
                >
                  <Sparkles size={16} /> Get Deep AI Explanation & Insights
                </button>

                {/* NAVIGATION BUTTONS */}
                <div style={styles.navBtns}>
                  <button
                    style={styles.prevBtn}
                    disabled={current === 0}
                    onClick={() => setCurrent((c) => c - 1)}
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>
                  <button
                    style={styles.nextBtn}
                    disabled={current === formattedAnalysis.length - 1}
                    onClick={() => setCurrent((c) => c + 1)}
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* SUBJECT GRAPH EXPANDABLE */}
            <AnimatePresence>
              {showGraph && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="glass-card"
                  style={styles.graphCard}
                >
                  <div style={styles.cardHeader}>
                    <BarChart2 size={18} color="#2563EB" />
                    <h4 style={styles.cardTitle}>Subject-wise Accuracy Breakdown</h4>
                  </div>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={subjectData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                      <XAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} unit="%" />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                        formatter={(val) => [`${val}%`, 'Accuracy']}
                      />
                      <Bar
                        dataKey="accuracy"
                        fill="#2563EB"
                        radius={[6, 6, 0, 0]}
                        barSize={32}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* AI EXPLANATION MODAL */}
        {showModal && (
          <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              
              <div style={styles.modalHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Sparkles size={18} color="#FFFFFF" />
                  <span style={styles.modalHeaderTitle}>AI Mentor Insights</span>
                </div>
                <button
                  style={styles.modalCloseBtn}
                  onClick={() => {
                    setShowModal(false);
                    setAiExplanation("");
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              <div style={styles.modalBody}>
                {thinkingStage !== "done" ? (
                  <div style={styles.thinkingBox}>
                    {thinkingStage === "thinking" && (
                      <div style={styles.thinkingStep}>
                        <Brain size={20} color="#2563EB" className="animate-pulse" />
                        <span>AI Mentor is reflecting on the question concept...</span>
                      </div>
                    )}

                    {thinkingStage === "analyzing" && (
                      <div style={styles.thinkingStep}>
                        <Search size={20} color="#F59E0B" />
                        <span>Analyzing distractors and correct answer logic...</span>
                      </div>
                    )}

                    {thinkingStage === "generating" && (
                      <div style={styles.thinkingStep}>
                        <Zap size={20} color="#10B981" />
                        <span>Structuring comprehensive explanation...</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={styles.markdownContent}>
                    <ReactMarkdown
                      components={{
                        h3: ({ children }) => (
                          <h3 style={styles.mdH3}>{children}</h3>
                        ),
                        li: ({ children }) => (
                          <li style={styles.mdLi}>{children}</li>
                        ),
                        p: ({ children }) => (
                          <p style={styles.mdP}>{children}</p>
                        ),
                      }}
                    >
                      {aiExplanation}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default ResultAnalysis;

/* ================= STYLES ================= */

const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: '#F8FAFC'
  },
  spinner: {
    width: 36,
    height: 32,
    border: '3px solid #E2E8F0',
    borderTopColor: '#2563EB',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: 16
  },

  page: {
    minHeight: "100vh",
    padding: "24px 40px 60px 40px",
    maxWidth: 1300,
    margin: "0 auto",
  },

  topHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  dashboardBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 16px",
    borderRadius: 10,
    background: "#FFFFFF",
    color: "#0F172A",
    fontSize: 13,
    fontWeight: 600,
    border: "1px solid #E2E8F0",
    cursor: "pointer",
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
  },
  headerTitleBlock: {
    textAlign: "center",
  },
  heading: {
    margin: 0,
    color: "#0F172A",
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: "-0.02em",
  },
  subHeading: {
    margin: "4px 0 0 0",
    color: "#64748B",
    fontSize: 13,
  },

  layout: {
    display: "flex",
    gap: 24,
    alignItems: "flex-start",
  },
  left: {
    width: "320px",
    display: "flex",
    flexDirection: "column",
    gap: 20,
    flexShrink: 0,
  },

  cardPadding: {
    padding: 22,
  },
  rightCardPadding: {
    padding: 28,
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  cardTitle: {
    margin: 0,
    fontSize: 14,
    fontWeight: 600,
    color: "#0F172A",
  },

  scoreRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 18,
  },
  scoreMetric: {
    display: "flex",
    flexDirection: "column",
  },
  scoreLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  scoreBig: {
    margin: "4px 0 0 0",
    fontSize: 28,
    fontWeight: 700,
    color: "#0F172A",
  },
  accuracyBadgeBlock: {
    marginBottom: 4,
  },
  accuracyBadge: {
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
  },

  metaDetails: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    paddingTop: 14,
    borderTop: "1px solid #F1F5F9",
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
    color: "#475569",
  },

  trackerGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: 8,
    marginBottom: 16,
  },
  trackBtn: {
    height: 36,
    borderRadius: 8,
    border: "none",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  legend: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTop: "1px solid #F1F5F9",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 11,
    color: "#64748B",
    fontWeight: 500,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
  },

  graphToggleBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    padding: "12px",
    borderRadius: 12,
    border: "1px solid #E2E8F0",
    background: "#FFFFFF",
    color: "#0F172A",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
  },

  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  subjectBadge: {
    background: "#EFF6FF",
    color: "#2563EB",
    border: "1px solid #BFDBFE",
    padding: "3px 10px",
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase",
  },
  yearBadge: {
    background: "#F1F5F9",
    color: "#475569",
    padding: "3px 10px",
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 600,
  },
  qIndex: {
    marginLeft: "auto",
    fontSize: 12,
    color: "#64748B",
    fontWeight: 600,
  },
  questionText: {
    fontSize: 17,
    fontWeight: 600,
    color: "#0F172A",
    lineHeight: 1.5,
    marginBottom: 20,
  },

  optionsList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginBottom: 24,
  },
  optionCard: {
    padding: "14px 18px",
    borderRadius: 12,
    border: "1px solid",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "all 0.2s ease",
  },
  optionLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  optionIndex: {
    width: 26,
    height: 26,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 700,
    flexShrink: 0,
  },
  optionText: {
    fontSize: 14,
    color: "#0F172A",
    fontWeight: 500,
  },
  correctTag: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    color: "#059669",
    fontWeight: 600,
    fontSize: 12,
  },
  wrongTag: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    color: "#DC2626",
    fontWeight: 600,
    fontSize: 12,
  },

  explanationBox: {
    padding: "16px 20px",
    background: "#F8FAFC",
    borderLeft: "4px solid #2563EB",
    borderRadius: "0 12px 12px 0",
    marginBottom: 20,
  },
  explanationHeader: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
    color: "#0F172A",
    marginBottom: 6,
  },
  explanationBody: {
    margin: 0,
    fontSize: 13,
    color: "#475569",
    lineHeight: 1.6,
  },

  aiBtn: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "12px",
    background: "#9333EA",
    color: "#FFFFFF",
    border: "none",
    borderRadius: 12,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    marginBottom: 24,
  },

  navBtns: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: 16,
    borderTop: "1px solid #F1F5F9",
  },
  prevBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 16px",
    borderRadius: 8,
    border: "1px solid #E2E8F0",
    background: "#FFFFFF",
    color: "#0F172A",
    fontWeight: 500,
    fontSize: 13,
    cursor: "pointer",
  },
  nextBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 18px",
    borderRadius: 8,
    border: "none",
    background: "#2563EB",
    color: "#FFFFFF",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
  },

  graphCard: {
    padding: 24,
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.5)",
    backdropFilter: "blur(6px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    padding: 20,
  },
  modal: {
    width: "100%",
    maxWidth: "680px",
    maxHeight: "80vh",
    background: "#FFFFFF",
    borderRadius: 20,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    border: "1px solid #E2E8F0",
  },
  modalHeader: {
    padding: "18px 24px",
    background: "#9333EA",
    color: "#FFFFFF",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalHeaderTitle: {
    fontSize: 15,
    fontWeight: 600,
  },
  modalCloseBtn: {
    background: "transparent",
    border: "none",
    color: "#FFFFFF",
    cursor: "pointer",
    display: "flex",
    padding: 4,
  },
  modalBody: {
    padding: 24,
    overflowY: "auto",
    flex: 1,
    fontSize: 14,
    lineHeight: 1.6,
    color: "#334155",
  },
  thinkingBox: {
    padding: "40px 0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  thinkingStep: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontSize: 14,
    fontWeight: 500,
    color: "#475569",
  },
  markdownContent: {
    color: "#0F172A",
  },
  mdH3: {
    fontSize: 15,
    fontWeight: 700,
    marginTop: 18,
    marginBottom: 8,
    color: "#0F172A",
    borderBottom: "1px solid #F1F5F9",
    paddingBottom: 4,
  },
  mdLi: {
    marginLeft: 18,
    marginBottom: 6,
    color: "#334155",
  },
  mdP: {
    marginBottom: 8,
    color: "#334155",
  },
};