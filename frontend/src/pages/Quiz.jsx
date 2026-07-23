import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { debounce } from 'lodash';
// AI Proctor
import WebcamFeed from "../components/AIProctor/WebcamFeed";
import FaceDetection from "../components/AIProctor/FaceDetector";
import BrowserMonitor from "../components/AIProctor/BrowserMonitor";
import ProctorMonitor from "../components/AIProctor/ProctorMonitor";

// const API = 'https://exam-86ot.onrender.com';
const API = import.meta.env.VITE_API_BASE_URL;
const socket = io(`${API}`);
export default function Quiz() {
  const { quizType } = useParams();
  const navigate = useNavigate();

  const QUESTION_TIME = 30;

  const [flatQuestions, setFlatQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showExit, setShowExit] = useState(false);

  const fullscreenAllowed = useRef(false);
  const fullscreenStarted = useRef(false);
  const timerRef = useRef(null);
  /* ================= AI PROCTOR ================= */

  const webcamRef = useRef(null);

  const [faceStatus, setFaceStatus] =
    useState("no-face");

  const [violations, setViolations] =
    useState([]);
  /* ================= FETCH QUIZ ================= */
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await axios.get(
            `${API}/api/quiz/start`,
          {
            params: { quizType },
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const flat = Array.isArray(res.data)
          ? res.data
          : Object.values(res.data).flat();

        setFlatQuestions(flat);
        setTimeLeft(flat.length * QUESTION_TIME);
        setLoading(false);
      } catch (err) {
        alert('Failed to load quiz');
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizType]);

  const q = flatQuestions[currentIndex];

  const handleViolation = async (violation) => {

    const event = {

        ...violation,

        timestamp: new Date().toISOString()

    };

    setViolations(prev => [...prev, event]);

    try{

        const token = localStorage.getItem("token");

        await axios.post(

            `${API}/api/proctor/violation`,

            {

                quizType,

                ...event

            },

            {

                headers:{

                    Authorization:`Bearer ${token}`

                }

            }

        );

    }

    catch(err){

        console.log(err);

    }

};

  // Auto Submit from AI Proctor

  const handleAutoSubmit = async (reason) => {

    const event = {

        type:
            reason.includes("Multiple")
                ? "MULTIPLE_FACES"
                : "NO_FACE",

        message: reason,

        timestamp: new Date().toISOString()

    };

    setViolations(prev => [...prev, event]);

    await handleViolation(event);
    await new Promise(resolve => setTimeout(resolve,300));
    handleSubmit();

};
  /* ================= FULLSCREEN ================= */

useEffect(() => {

  const handleFullscreen = () => {

    if (
      fullscreenAllowed.current &&
      !document.fullscreenElement &&
      !submitted
    ) {

      handleViolation({

        type: "FULLSCREEN_EXIT",

        message: "Fullscreen exited."

      });

      handleSubmit();

    }

  };

  document.addEventListener(
    "fullscreenchange",
    handleFullscreen
  );

  return () =>
    document.removeEventListener(
      "fullscreenchange",
      handleFullscreen
    );

}, [submitted]);

  /* ================= GLOBAL TIMER ================= */
  useEffect(() => {
    if (loading || submitted) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit("Quiz timer expired.");
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [loading, submitted]);
/* ================= BROWSER MONITOR ================= */

useEffect(() => {

  const browserViolation = (event) => {

    handleViolation(event);

  };

  return () => {};

}, []);

  /* ================= ANSWER ================= */
  const selectAnswer = async (qid, optionIndex) => {
    if (submitted || submitting) return;
    if (!document.fullscreenElement) {

        await document.documentElement.requestFullscreen();
    
    }
    setAnswers(prev => ({ ...prev, [qid]: optionIndex }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    clearInterval(timerRef.current);
    if (submitted || submitting) return;
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');

      const payload = Object.entries(answers).map(
        ([qid, answerIndex]) => ({
          qid,
          answer: answerIndex,

        })
      );

      let quizTypeLabel = '';
      if (quizType === '20') quizTypeLabel = 'Quick 20';
      else if (quizType === '30') quizTypeLabel = 'Good 30';
      else if (quizType === 'subject')
        quizTypeLabel = 'Focused Subject Test';

      const totalTime = flatQuestions.length * QUESTION_TIME;
      const timeTaken = totalTime - timeLeft;

      const res = await axios.post(
        `${API}/api/quiz/submit`,
        {
          answers: payload,
          quizType: quizTypeLabel,
          timeTaken,
          totalQuestions: flatQuestions.length,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setScore(res.data.score);
      setSubmitted(true);

      fullscreenAllowed.current = false;
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    } catch (err) {
      alert('Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= RESULT ================= */
  if (submitted) {
    const percentage = ((score / flatQuestions.length) * 100).toFixed(2);

    return (
      <div style={styles.center}>
        <div style={styles.resultCard}>
          <h2 style={styles.title}>UPSC Mock Test Result</h2>

          <div style={styles.scoreCircle}>
            <span style={styles.scoreText}>{score}</span>
            <span style={styles.totalText}>/ {flatQuestions.length}</span>
          </div>

          <p style={styles.percentage}>
            Percentage: <strong>{percentage}%</strong>
          </p>

          <p style={styles.message}>
            {percentage >= 60
              ? 'Great work! Keep refining your answers.'
              : 'Good attempt! Analyze mistakes and improve.'}
          </p>

          <button
            style={styles.dashboardBtn}
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (loading || !q) {
    return <p style={styles.loading}>Loading…</p>;
  }

  /* ================= UI ================= */
  return (
    <div style={styles.page}>
      <BrowserMonitor
        onViolation={handleViolation}
      />
      <FaceDetection
        webcamRef={webcamRef}
        setStatus={setFaceStatus}
      />
      <ProctorMonitor
        status={faceStatus}
        onAutoSubmit={handleAutoSubmit}
      />
      <div style={styles.topBar}>
        <span style={styles.timerTop}>
          ⏱ {Math.floor(timeLeft / 60)}:
          {(timeLeft % 60).toString().padStart(2, '0')}
        </span>

        <div style={styles.palette}>
          {flatQuestions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              style={{
                ...styles.circle,
                background:
                  i === currentIndex
                    ? '#fde047'
                    : answers[flatQuestions[i]._id] !== undefined
                    ? '#2563eb'
                    : '#e5e7eb',
                color:
                  i === currentIndex ||
                  answers[flatQuestions[i]._id] !== undefined
                    ? '#fff'
                    : '#000',
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* CARD */}
      <div style={styles.card}>
        <div style={styles.left}>

          {/* ===== NEW : SUBJECT + YEAR ===== */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
            <span
              style={{
                background: '#2563eb',
                color: '#fff',
                padding: '4px 12px',
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {q.subject}
            </span>

            <span
              style={{
                background: '#e5e7eb',
                padding: '4px 12px',
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {q.year}
            </span>
          </div>

          <h2>Question {currentIndex + 1}</h2>
          <p style={styles.question}>{q.question}</p>

          {/* ===== NEW : TAGS ===== */}
          {q.tags && q.tags.length > 0 && (
            <div
              style={{
                display: 'flex',
                gap: 10,
                flexWrap: 'wrap',
                marginTop: 12,
              }}
            >
              {q.tags.map((tag, idx) => (
                <span
                  key={idx}
                  style={{
                    background: '#fef3c7',
                    color: '#92400e',
                    padding: '4px 10px',
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div style={styles.right}>
          {q.options.map((opt, idx) => (
            <label
              key={idx}
              style={{
                ...styles.option,
                background:
                  answers[q._id] === idx ? '#2563eb' : '#f1f5ff',
                color: answers[q._id] === idx ? '#fff' : '#000',
              }}
            >
              <input
                type="radio"
                checked={answers[q._id] === idx}
                onChange={() => selectAnswer(q._id, idx)}
              />
              {opt}
            </label>
          ))}
        </div>
      </div>

      {/* NAV */}
      <div style={styles.navBar}>
        <button
          style={styles.prevBtn}
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex(i => Math.max(i - 1, 0))}
        >
          ← Previous
        </button>

        <button
          style={styles.nextBtn}
          disabled={currentIndex === flatQuestions.length - 1}
          onClick={async () => {
            if (!document.fullscreenElement) {

                await document.documentElement.requestFullscreen();
            
            }
            setCurrentIndex(i =>
              Math.min(i + 1, flatQuestions.length - 1)
            );
          }}
        >
          Next →
        </button>

        <button
          style={styles.submitBtn}
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Exam'}
        </button>
      </div>

      <button style={styles.exit} onClick={() => setShowExit(true)}>
        ✖
      </button>

      {/* {!submitted && <CameraFeed />} */}
      {!submitted && (
        <WebcamFeed
            webcamRef={webcamRef}
            status={faceStatus}
        />
      )}
      {showExit && (
        <div style={styles.modal}>
          <div style={styles.modalBox}>
            <p>Exit exam? Quiz will be submitted.</p>
            <button
              onClick={() => {

                  handleViolation({

                      type:"MANUAL_EXIT",

                      message:"Student exited exam."

                  });

                  handleSubmit();

              }}
            >Exit & Submit</button>
            <button onClick={() => setShowExit(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}


/* ================= STYLES ================= */
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#eef2ff 0%,#f8fafc 45%,#ffffff 100%)",
    padding: "30px",
    fontFamily: "'Inter', sans-serif",
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#fff",
    padding: "18px 28px",
    borderRadius: 20,
    boxShadow: "0 10px 35px rgba(0,0,0,.08)",
    marginBottom: 25,
  },

  timerTop: {
    background: "#2563eb",
    color: "#fff",
    padding: "14px 24px",
    borderRadius: 18,
    fontWeight: 700,
    fontSize: 18,
    boxShadow: "0 8px 20px rgba(37,99,235,.35)",
  },

  palette: {
    display: "flex",
    gap: 12,
    overflowX: "auto",
    maxWidth: "75%",
    padding: "4px",
  },

  circle: {
    width: 46,
    height: 46,
    borderRadius: 14,
    border: "none",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all .25s ease",
    boxShadow: "0 5px 15px rgba(0,0,0,.08)",
  },

  card: {
    display: "flex",
    background: "#fff",
    borderRadius: 24,
    maxWidth: 1300,
    margin: "auto",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
    boxShadow: "0 20px 45px rgba(0,0,0,.08)",
  },

  left: {
    flex: 1,
    padding: "60px",
    borderRight: "1px solid #eef2f7",
  },

  right: {
    flex: 1,
    padding: "60px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: 20,
  },

  question: {
    fontSize: 27,
    lineHeight: 1.8,
    fontWeight: 600,
    color: "#111827",
    marginTop: 20,
  },

  option: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "18px 22px",
    borderRadius: 16,
    border: "2px solid #dbeafe",
    cursor: "pointer",
    fontSize: 17,
    fontWeight: 500,
    transition: "all .25s ease",
    boxShadow: "0 6px 15px rgba(0,0,0,.05)",
  },

  navBar: {
    display: "flex",
    justifyContent: "center",
    gap: 25,
    marginTop: 35,
  },

  prevBtn: {
    padding: "14px 30px",
    borderRadius: 14,
    border: "1px solid #d1d5db",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 16,
    transition: "all .25s ease",
    boxShadow: "0 6px 15px rgba(0,0,0,.05)",
  },

  nextBtn: {
    padding: "14px 30px",
    borderRadius: 14,
    border: "none",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 16,
    transition: "all .25s ease",
    boxShadow: "0 10px 22px rgba(37,99,235,.25)",
  },

  submitBtn: {
    padding: "14px 36px",
    borderRadius: 14,
    border: "none",
    background: "linear-gradient(135deg,#16a34a,#22c55e)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 16,
    transition: "all .25s ease",
    boxShadow: "0 10px 22px rgba(34,197,94,.3)",
  },

  exit: {
    position: "fixed",
    bottom: 20,
    left: 20,
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "14px 22px",
    borderRadius: 14,
    cursor: "pointer",
    fontWeight: 700,
    boxShadow: "0 10px 22px rgba(239,68,68,.25)",
    zIndex: 1000,
  },

  modal: {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,.55)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backdropFilter: "blur(6px)",
  },

  modalBox: {
    width: 420,
    background: "#fff",
    borderRadius: 20,
    padding: 35,
    textAlign: "center",
    boxShadow: "0 20px 50px rgba(0,0,0,.18)",
  },

  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg,#eef2ff,#f8fafc)",
  },

  loading: {
    fontSize: 22,
    color: "#2563eb",
    textAlign: "center",
    marginTop: 80,
    fontWeight: 600,
  },

  resultCard: {
    background: "#fff",
    width: 450,
    padding: 50,
    borderRadius: 24,
    textAlign: "center",
    boxShadow: "0 20px 45px rgba(0,0,0,.08)",
  },

  title: {
    fontSize: 26,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 25,
  },

  scoreCircle: {
    width: 170,
    height: 170,
    borderRadius: "50%",
    margin: "0 auto 30px",
    background: "linear-gradient(135deg,#2563eb,#1e3a8a)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    boxShadow: "0 15px 35px rgba(37,99,235,.35)",
  },

  scoreText: {
    fontSize: 52,
    fontWeight: 700,
  },

  totalText: {
    fontSize: 20,
    marginLeft: 6,
  },

  percentage: {
    fontSize: 18,
    color: "#374151",
    marginBottom: 12,
  },

  message: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 28,
    lineHeight: 1.6,
  },

  dashboardBtn: {
    padding: "14px 30px",
    fontSize: 16,
    fontWeight: 700,
    color: "#fff",
    background: "linear-gradient(135deg,#16a34a,#15803d)",
    border: "none",
    borderRadius: 14,
    cursor: "pointer",
    transition: "all .25s ease",
    boxShadow: "0 10px 22px rgba(22,163,74,.3)",
  },
};