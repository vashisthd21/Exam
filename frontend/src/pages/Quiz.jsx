import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { debounce } from 'lodash';
import CameraFeed from './CameraFeed';


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

  /* ================= FULLSCREEN ================= */
  const requestFullscreen = async () => {
    if (fullscreenStarted.current) return;

    try {
      await document.documentElement.requestFullscreen();
      fullscreenStarted.current = true;
      fullscreenAllowed.current = true;
    } catch {}
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      if (
        fullscreenAllowed.current &&
        !document.fullscreenElement &&
        !submitted
      ) {
        alert('Fullscreen exited. Submitting exam.');
        handleSubmit();
      }
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, [submitted]);

  /* ================= GLOBAL TIMER ================= */
  useEffect(() => {
    if (loading || submitted) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [loading, submitted]);

  /* ================= TAB SWITCH ================= */
  useEffect(() => {
    const handler = debounce(() => {
      if (document.hidden && !submitted) {
        socket.emit('tab-switch', { reason: 'visibility-change' });
        handleSubmit();
      }
    }, 800);

    document.addEventListener('visibilitychange', handler);
    return () =>
      document.removeEventListener('visibilitychange', handler);
  }, [submitted]);

  /* ================= ANSWER ================= */
  const selectAnswer = async (qid, optionIndex) => {
    if (submitted || submitting) return;
    await requestFullscreen();
    setAnswers(prev => ({ ...prev, [qid]: optionIndex }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
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
            await requestFullscreen();
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

      {!submitted && <CameraFeed />}

      {showExit && (
        <div style={styles.modal}>
          <div style={styles.modalBox}>
            <p>Exit exam? Quiz will be submitted.</p>
            <button onClick={handleSubmit}>Exit & Submit</button>
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
    minHeight: '100vh',
    background: 'linear-gradient(180deg,#0b3a82,#eaf1ff)',
    padding: 20,
    fontFamily: "'Inter', sans-serif",
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timerTop: {
    background: '#1e40af',
    color: '#fff',
    padding: '8px 18px',
    borderRadius: 20,
    fontWeight: 700,
  },
  palette: {
    display: 'flex',
    gap: 10,
    overflowX: 'auto',
    maxWidth: '75%',
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    border: 'none',
    fontWeight: 700,
    cursor: 'pointer',
  },
  card: {
    display: 'flex',
    height: '68vh',
    background: '#fff',
    borderRadius: 18,
    maxWidth: 1200,
    margin: 'auto',
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
  },
  left: {
    flex: 1,
    padding: '50px',
    borderRight: '1px solid #e5e7eb',
  },
  right: {
    flex: 1,
    padding: '50px',
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  },
  question: {
    fontSize: 22,
    lineHeight: 1.6,
  },
  option: {
    padding: '16px',
    borderRadius: 14,
    display: 'flex',
    gap: 14,
    cursor: 'pointer',
    fontSize: 16,
  },
  navBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: 20,
    marginTop: 25,
  },
  prevBtn: {
    padding: '12px 26px',
    borderRadius: 12,
    border: '1px solid #cbd5e1',
  },
  nextBtn: {
    padding: '12px 26px',
    borderRadius: 12,
    background: '#2563eb',
    color: '#fff',
  },
  submitBtn: {
    padding: '12px 34px',
    borderRadius: 14,
    background: 'linear-gradient(135deg,#16a34a,#22c55e)',
    color: '#fff',
    fontWeight: 700,
  },
  exit: {
    position: 'fixed',
    bottom: 25,
    right: 25,
    background: '#ef4444',
    color: '#fff',
    width: 48,
    height: 48,
    borderRadius: '50%',
  },
  modal: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.45)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    background: '#fff',
    padding: 30,
    borderRadius: 12,
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
  },
  resultBox: {
    background: '#fff',
    padding: 40,
    borderRadius: 16,
  },
  loading: {
    color: '#fff',
    textAlign: 'center',
  },
  resultCard: {
    background: "#ffffff",
    padding: "40px",
    borderRadius: "16px",
    width: "380px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  },

  title: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: "20px",
  },

  scoreCircle: {
    width: "140px",
    height: "140px",
    borderRadius: "50%",
    margin: "0 auto 20px",
    background: "linear-gradient(135deg, #2563eb, #1e40af)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    boxShadow: "0 8px 20px rgba(37,99,235,0.4)",
  },

  scoreText: {
    fontSize: "42px",
    fontWeight: "700",
  },

  totalText: {
    fontSize: "18px",
    marginLeft: "6px",
  },

  percentage: {
    fontSize: "16px",
    color: "#374151",
    marginBottom: "10px",
  },

  message: {
    fontSize: "15px",
    color: "#6b7280",
    marginBottom: "25px",
  },

  dashboardBtn: {
    padding: "12px 22px",
    fontSize: "15px",
    fontWeight: "600",
    color: "#fff",
    background: "linear-gradient(135deg, #16a34a, #15803d)",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "transform 0.2s ease",
  }
};
