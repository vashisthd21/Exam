import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
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
// const API = 'https://exam-86ot.onrender.com';
const questionVariants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
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
  const [rawText, setRawText] = useState("");
  const [thinkingStage, setThinkingStage] = useState("");
const explainWithAI = async (q) => {
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
You are an expert UPSC mentor.

Your task is to explain the following multiple-choice question in a way that helps a UPSC aspirant understand and remember it.

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
- Add a short trick or tip useful for UPSC Prelims or Mains.

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
${q.options[q.correctAnswer]}

User Answer:
${q.options[q.userAnswer]}
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
    setAiExplanation("⚠️ Failed to fetch AI explanation");
  }

  setLoadingAI(false);
};
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
          {/* GRAPH TOGGLE BUTTON */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowGraph(prev => !prev)}
              style={styles.graphToggleBtn}
            >
              {showGraph ? "Hide Subject-wise Analysis ▲" : "Show Subject-wise Analysis ▼"}
            </motion.button>
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
            <button
              onClick={() => explainWithAI(q)}
              style={styles.aiBtn}
            >
              🤖 Click to get more detailed explanation of the answer using AI.
            </button>
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
            <AnimatePresence>
              {showGraph && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  style={styles.graphBox}
                >
                  <h4>📊 Subject-wise Accuracy</h4>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={subjectData}>
                      <XAxis dataKey="subject" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="accuracy"
                        fill="#2563eb"
                        radius={[6,6,0,0]}
                        isAnimationActive
                        animationDuration={900}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
      {showModal && (
  <div style={styles.modalOverlay}>
    <div style={styles.modal}>
      
      {/* HEADER */}
      <div style={styles.modalHeader}>
        <span>🤖 AI Explanation</span>
        <span
          style={{ cursor: "pointer" }}
          onClick={() => {
            setShowModal(false);
            setAiExplanation("");
            setRawText("");
          }}
        >
          ✖
        </span>
      </div>

      {/* BODY */}
      <div style={styles.modalBody}>
  {thinkingStage !== "done" ? (
    <div style={styles.thinkingBox}>
      
      {thinkingStage === "thinking" && (
        <p>🧠 AI is thinking about the explanation...</p>
      )}

      {thinkingStage === "analyzing" && (
        <p>🔍 Analyzing question and options...</p>
      )}

      {thinkingStage === "generating" && (
        <p>⚡ Generating explanation... Please wait</p>
      )}

    </div>
  ) : (
    <ReactMarkdown
      components={{
        h3: ({ children }) => (
          <h3 style={{ fontWeight: "700", marginTop: 10 }}>
            {children}
          </h3>
        ),
        li: ({ children }) => (
          <li style={{ marginLeft: 18, marginBottom: 6 }}>
            {children}
          </li>
        ),
        p: ({ children }) => (
          <p style={{ marginBottom: 6 }}>
            {children}
          </p>
        ),
      }}
    >
      {aiExplanation}
    </ReactMarkdown>
  )}
</div>
    </div>
  </div>
)}
    </div>
  );
};

export default ResultAnalysis;


const styles = {
  graphToggleBtn: {
  marginTop: 20,
  padding: "10px 18px",
  borderRadius: 999,
  border: "none",
  background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 8px 20px rgba(37,99,235,0.3)",
  transition: "all 0.25s ease",
},
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
  aiBtn: {
  marginTop: 12,
  background: "linear-gradient(135deg,#9333ea,#7e22ce)",
  color: "#fff",
  border: "none",
  padding: "10px 16px",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: 600,
},

modalOverlay: {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
},

modal: {
  width: "650px",
  maxHeight: "80vh", // 🔥 IMPORTANT
  background: "#fff",
  borderRadius: 16,
  display: "flex",
  flexDirection: "column", // 🔥 IMPORTANT
  overflow: "hidden",
},

modalHeader: {
  padding: "12px 16px",
  background: "#2563eb",
  color: "#fff",
  display: "flex",
  justifyContent: "space-between",
},

modalBody: {
  padding: 16,
  overflowY: "auto",
  flex: 1,
  fontSize: 14,
  lineHeight: 1.6,

  scrollbarWidth: "thin",
},
thinkingBox: {
  fontSize: 15,
  color: "#334155",
  display: "flex",
  flexDirection: "column",
  gap: 10,
  paddingTop: 10,
},
};
