import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#22c55e", "#ef4444"];
const API = import.meta.env.VITE_API_BASE_URL;
/* ================= ANIMATION VARIANTS ================= */
const questionVariants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

const ResultAnalysis = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchAttempt = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API}/api/quiz/attempt/${attemptId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData(res.data);
    };
    fetchAttempt();
  }, [attemptId]);

  if (!data) return null;

  const q = data.analysis[current];
  const incorrect = data.totalQuestions - data.score;

  /* ========= PIE DATA ========= */
  const accuracyData = [
    { name: "Correct", value: data.score },
    { name: "Incorrect", value: incorrect },
  ];

  /* ========= SUBJECT BAR DATA ========= */
  const subjectMap = {};
  data.analysis.forEach(q => {
    if (!subjectMap[q.subject]) {
      subjectMap[q.subject] = { correct: 0, total: 0 };
    }
    subjectMap[q.subject].total++;
    if (q.userAnswer === q.correctAnswer) {
      subjectMap[q.subject].correct++;
    }
  });

  const subjectData = Object.keys(subjectMap).map(subject => ({
    subject,
    accuracy: Math.round(
      (subjectMap[subject].correct / subjectMap[subject].total) * 100
    ),
  }));

  return (
    <div style={styles.page}>
      <button
        style={styles.dashboardBtn}
        onClick={() => navigate("/dashboard")}
      >
        ← Go to Dashboard
      </button>


      <h1 style={styles.heading}>
        📊 UPSC Mock Test Analysis
        <span style={styles.headingUnderline}></span>
      </h1>

      <div style={styles.layout}>
        {/* ================= LEFT PANEL ================= */}
        <div style={styles.left}>
          {/* ACCURACY CARD */}
          <div style={styles.accuracyCard}>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={accuracyData}
                  innerRadius={62}
                  outerRadius={78}
                  dataKey="value"
                >
                  {accuracyData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div style={styles.accuracyCenter}>
              <h2>{data.score}/{data.totalQuestions}</h2>
              <span style={styles.accuracyBadge}>
                {data.accuracy}% Accuracy
              </span>
            </div>

            <div style={styles.scoreMeta}>
              <span style={{ color: "#22c55e" }}>{data.score} Correct</span>
              <span style={{ color: "#ef4444" }}>{incorrect} Incorrect</span>
              <span>{data.totalQuestions} Total</span>
            </div>
          </div>

          {/* EXAM SUMMARY */}
          <div style={styles.summary}>
            <h4>📘 Exam Summary</h4>
            <p><b>Type:</b> {data.quizType}</p>
            <p><b>Time:</b> {Math.floor(data.timeTaken / 60)} min {Math.floor(data.timeTaken%60)} sec</p>
            <p><b>Attempted:</b> {new Date(data.createdAt).toLocaleString()}</p>
          </div>

          {/* QUESTION TRACKER */}
          <div style={styles.tracker}>
            <h4>Questions</h4>
            <div style={styles.trackerGrid}>
              {data.analysis.map((x, i) => (
                <button
                  key={i}
                  onClick={() => i !== current && setCurrent(i)}
                  style={{
                    ...styles.trackBtn,
                    background:
                      i === current
                        ? "#2563eb"
                        : x.userAnswer === x.correctAnswer
                        ? "#22c55e"
                        : "#ef4444",
                    transform: i === current ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ================= RIGHT PANEL (ANIMATED) ================= */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            variants={questionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={styles.rightPanel}
          >
            {/* QUESTION META */}
            <div style={styles.metaRow}>
              <span style={styles.subject}>{q.subject}</span>
              <span style={styles.year}>{q.year}</span>
              <span style={styles.qIndex}>
                Question {current + 1} / {data.analysis.length}
              </span>
            </div>

            <h2 style={styles.questionText}>{q.question}</h2>

            {/* OPTIONS */}
            {q.options.map((opt, i) => {
              const isCorrect = i === q.correctAnswer;
              const isUser = i === q.userAnswer;

              return (
                <div
                  key={i}
                  style={{
                    ...styles.option,
                    borderLeft: isCorrect
                      ? "6px solid #22c55e"
                      : isUser
                      ? "6px solid #ef4444"
                      : "6px solid transparent",
                    background: isCorrect
                      ? "#ecfdf5"
                      : isUser
                      ? "#fef2f2"
                      : "#f8fafc",
                  }}
                >
                  <span>{opt}</span>
                  {isCorrect && <span style={styles.correctTag}>✔ Correct</span>}
                  {isUser && !isCorrect && (
                    <span style={styles.wrongTag}>✖ Your Answer</span>
                  )}
                </div>
              );
            })}

            {/* EXPLANATION */}
            <div style={styles.explanation}>
              <strong>Explanation:</strong>
              <p>{q.explanation}</p>
            </div>

            {/* NAV BUTTONS */}
            <div style={styles.navBtns}>
              <button
                style={styles.prevBtn}
                disabled={current === 0}
                onClick={() => setCurrent(c => c - 1)}
              >
                ← Previous
              </button>
              <button
                style={styles.nextBtn}
                disabled={current === data.analysis.length - 1}
                onClick={() => setCurrent(c => c + 1)}
              >
                Next →
              </button>
            </div>

            {/* SUBJECT GRAPH */}
            <div style={styles.graphBox}>
              <h4>📊 Subject-wise Accuracy</h4>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={subjectData}>
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="accuracy" fill="#2563eb" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ResultAnalysis;


const styles = {
  page: {
    position: "relative",
    minHeight: "100vh",
    background: "linear-gradient(180deg,#063970,#e6f0ff)",
    padding: "10px 30px", // 🔽 reduced top padding
    fontFamily: "'Inter', sans-serif",
  },

  dashboardBtn: {
  position: "absolute", // ✅ NOT fixed
  top: 18,
  left: 20,

  display: "flex",
  alignItems: "center",
  gap: 8,
  zIndex: 50,
  padding: "10px 18px",
  borderRadius: 999,
  background: "linear-gradient(135deg,#2563eb,#1e40af)",
  color: "#fff",

  fontSize: 14,
  fontWeight: 700,
  border: "none",
  cursor: "pointer",

  boxShadow: "0 8px 20px rgba(37,99,235,0.35)",
  transition: "all 0.25s ease",
},
  heading: {
    textAlign: "center",
    color: "#ffffff",
    fontSize: 26,
    fontWeight: 800,
    letterSpacing: "0.5px",
    marginBottom: 18,   // 🔽 reduced
    position: "relative",
  },

  headingUnderline: {
    display: "block",
    width: 80,
    height: 4,
    margin: "10px auto 0",
    borderRadius: 4,
    background: "linear-gradient(90deg,#60a5fa,#2563eb)",
  },

  layout: {
    display: "flex",
    gap: 24,
    maxWidth: 1350,
    margin: "0 auto",
  },
  left: {
    width: "34%",
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
  rightPanel: {
    width: "66%",
    background: "#fff",
    borderRadius: 22,
    padding: 28,
  },

  accuracyCard: {
    background: "#fff",
    borderRadius: 18,
    padding: 20,
    position: "relative",
    textAlign: "center",
  },
  accuracyCenter: {
  position: "absolute",
  top: 72,
  left: 0,
  right: 0,
  textAlign: "center",
},

accuracyBadge: {
  display: "inline-block",
  marginTop: 6,
  padding: "4px 12px",
  borderRadius: 999,
  fontSize: 13,
  fontWeight: 600,
  color: "#1e40af",
  background: "#dbeafe", // calm blue instead of red
},

  scoreMeta: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: 10,
    fontSize: 14,
    fontWeight: 600,
  },

  summary: {
    background: "#fff",
    borderRadius: 18,
    padding: 18,
    fontSize: 14,
  },

  tracker: {
    background: "#fff",
    borderRadius: 18,
    padding: 18,
  },
  trackerGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5,1fr)",
    gap: 8,
    marginTop: 10,
  },
  trackBtn: {
    padding: 8,
    borderRadius: 8,
    color: "#fff",
    border: "none",
    fontWeight: 600,
    cursor: "pointer",
  },

  metaRow: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  subject: {
    background: "#2563eb",
    color: "#fff",
    padding: "4px 12px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
  },
  year: {
    background: "#e5e7eb",
    padding: "4px 12px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
  },
  qIndex: {
    marginLeft: "auto",
    fontSize: 12,
    color: "#64748b",
    fontWeight: 600,
  },
  questionText: {
    fontSize: 20,
    marginBottom: 12,
  },

  option: {
    padding: "14px 16px",
    borderRadius: 14,
    marginTop: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 15,
  },
  correctTag: {
    color: "#16a34a",
    fontWeight: 600,
  },
  wrongTag: {
    color: "#dc2626",
    fontWeight: 600,
  },

  explanation: {
    marginTop: 18,
    padding: 18,
    background: "#f1f5f9",
    borderLeft: "5px solid #2563eb",
    borderRadius: 12,
    fontSize: 14,
  },

  graphBox: {
    marginTop: 26,
    background: "#f8fafc",
    padding: 20,
    borderRadius: 18,
  },

  navBtns: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 22,
  },
  prevBtn: {
    padding: "10px 20px",
    borderRadius: 999,
    border: "1px solid #cbd5e1",
    background: "#f8fafc",
    fontWeight: 600,
    cursor: "pointer",
  },
  nextBtn: {
    padding: "10px 24px",
    borderRadius: 999,
    border: "none",
    background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },
};
