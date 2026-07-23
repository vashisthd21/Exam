import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import studentAPI from "../services/studentAPI";
import ExamProctor from "../components/AIProctor/ExamProctor";
import {
  Clock,
  FileText,
  Target,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  Send
} from "lucide-react";

const StudentExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  /* ---------------- STATE ---------------- */
  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState(null);
  const webcamRef = useRef(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState([]);
  const [visited, setVisited] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  /* ---------------- FETCH EXAM ---------------- */
  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await studentAPI.getExamById(id);
        const examData = res.data.exam;
        setExam(examData);
        setQuestions(examData.questions || []);
        setTimeLeft(examData.duration * 60);
      } catch (err) {
        console.error(err);
        alert("Unable to load exam.");
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [id]);

  useEffect(() => {
    const handleFullscreen = () => {
      if (!document.fullscreenElement) {
        alert("Please stay in Fullscreen Mode.");
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreen);
    return () => document.removeEventListener("fullscreenchange", handleFullscreen);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    if (!timeLeft) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  /* ---------------- AUTO SUBMIT ---------------- */
  useEffect(() => {
    if (timeLeft === 0 && exam) {
      handleAutoSubmit();
    }
  }, [timeLeft]);

  /* ---------------- VISITED ---------------- */
  useEffect(() => {
    if (!questions.length) return;
    const qId = questions[currentQuestion]?._id;
    if (!qId) return;
    if (!visited.includes(qId)) {
      setVisited((prev) => [...prev, qId]);
    }
  }, [currentQuestion, questions]);

  /* ---------------- FORMAT TIMER ---------------- */
  const formatTime = () => {
    const hrs = Math.floor(timeLeft / 3600);
    const mins = Math.floor((timeLeft % 3600) / 60);
    const secs = timeLeft % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  /* ---------------- ANSWER ---------------- */
  const selectAnswer = (optionIndex) => {
    const qId = questions[currentQuestion]._id;
    setAnswers((prev) => ({
      ...prev,
      [qId]: optionIndex,
    }));
  };

  /* ---------------- REVIEW ---------------- */
  const toggleReview = () => {
    const qId = questions[currentQuestion]._id;
    if (markedForReview.includes(qId)) {
      setMarkedForReview((prev) => prev.filter((item) => item !== qId));
    } else {
      setMarkedForReview((prev) => [...prev, qId]);
    }
  };

  /* ---------------- NAVIGATION ---------------- */
  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  /* ---------------- SUBMIT ---------------- */
  const handleAutoSubmit = async () => {
    try {
      const formattedAnswers = Object.entries(answers).map(
        ([questionId, selectedOption]) => ({
          questionId,
          selectedOption,
        })
      );
      const payload = {
        answers: formattedAnswers,
        timeTaken: exam.duration * 60,
      };
      const res = await studentAPI.submitExam(id, payload);
      alert("Time Over! Exam Submitted.");
      navigate(`/exam/result/${res.data.attemptId}`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmitExam = async () => {
    if (submitting) return;
    const confirmSubmit = window.confirm("Are you sure you want to submit the exam?");
    if (!confirmSubmit) return;
    try {
      setSubmitting(true);
      const formattedAnswers = Object.entries(answers).map(
        ([questionId, selectedOption]) => ({
          questionId,
          selectedOption,
        })
      );
      const payload = {
        answers: formattedAnswers,
        timeTaken: exam.duration * 60 - timeLeft,
      };
      const res = await studentAPI.submitExam(id, payload);
      alert("Exam submitted successfully.");
      navigate(`/exam/result/${res.data.attemptId}`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={{ color: '#64748B', fontWeight: 500 }}>Loading Secure Assessment...</p>
      </div>
    );
  }

  if (!exam) {
    return (
      <div style={styles.loadingContainer}>
        <p style={{ color: '#0F172A', fontWeight: 600 }}>Exam not found.</p>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const answeredCount = Object.keys(answers).length;
  const reviewCount = markedForReview.length;
  const remainingCount = questions.length - answeredCount;

  return (
    <>
      <style>{`
        body { margin: 0; background: #F8FAFC; font-family: 'Inter', -apple-system, sans-serif; }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          border: 1px solid #E2E8F0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02), 0 8px 16px rgba(0,0,0,0.02);
          border-radius: 18px;
        }

        .option-hover { transition: all 0.2s ease; }
        .option-hover:hover { border-color: #93C5FD; background: #F8FAFC; }
        
        .btn-hover { transition: all 0.2s ease; }
        .btn-hover:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15); }

        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
      `}</style>

      <div style={styles.page} className="animate-fade-in">
        {/* PROCTORING SYSTEM */}
        <ExamProctor
          examId={id}
          webcamRef={webcamRef}
          submitExam={handleSubmitExam}
        />

        {/* HEADER */}
        <header className="glass-card" style={styles.header}>
          <div>
            <h2 style={styles.examTitle}>{exam.title}</h2>
            <p style={styles.examSubject}>{exam.subject}</p>
          </div>
          
          <div style={styles.examInfo}>
            <div style={styles.infoChip}>
              <FileText size={15} color="#2563EB" />
              <span>{questions.length} Questions</span>
            </div>
            <div style={styles.infoChip}>
              <Target size={15} color="#D97706" />
              <span>{exam.difficulty}</span>
            </div>
            <div style={styles.timerChip}>
              <Clock size={16} color="#FFFFFF" />
              <span>{formatTime()}</span>
            </div>
          </div>
        </header>

        {/* BODY */}
        <div style={styles.body}>
          
          {/* LEFT PANEL: QUESTION SECTION */}
          <div className="glass-card" style={styles.questionSection}>
            <div style={styles.questionSectionTop}>
              <span style={styles.questionCounter}>Question {currentQuestion + 1} of {questions.length}</span>
            </div>

            <div style={styles.progressContainer}>
              <div style={{ ...styles.progress, width: `${((currentQuestion + 1) / questions.length) * 100}%` }}></div>
            </div>

            <h3 style={styles.questionText}>{question.question}</h3>

            <div style={styles.optionsContainer}>
              {question.options.map((option, index) => {
                const isSelected = answers[question._id] === index;
                return (
                  <div
                    key={index}
                    onClick={() => selectAnswer(index)}
                    className="option-hover"
                    style={{
                      ...styles.optionCard,
                      borderColor: isSelected ? "#2563EB" : "#E2E8F0",
                      background: isSelected ? "#EFF6FF" : "#FFFFFF",
                    }}
                  >
                    <div style={{
                      ...styles.optionCircle,
                      background: isSelected ? "#2563EB" : "#F1F5F9",
                      color: isSelected ? "#FFFFFF" : "#475569"
                    }}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "#0F172A", flex: 1 }}>{option}</div>
                  </div>
                );
              })}
            </div>

            <div style={styles.buttonRow}>
              <button 
                style={styles.secondaryBtn} 
                onClick={previousQuestion} 
                disabled={currentQuestion === 0}
              >
                <ChevronLeft size={16} /> Previous
              </button>
              
              <button 
                style={{
                  ...styles.reviewBtn,
                  background: markedForReview.includes(question._id) ? "#FEF3C7" : "#F1F5F9",
                  color: markedForReview.includes(question._id) ? "#D97706" : "#475569",
                  borderColor: markedForReview.includes(question._id) ? "#F59E0B" : "#E2E8F0"
                }} 
                onClick={toggleReview}
              >
                <Bookmark size={16} />
                {markedForReview.includes(question._id) ? "Marked for Review" : "Mark for Review"}
              </button>

              <button 
                style={styles.primaryBtn} 
                className="btn-hover"
                onClick={nextQuestion} 
                disabled={currentQuestion === questions.length - 1}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* RIGHT PANEL: PALETTE & SUMMARY */}
          <div className="glass-card" style={styles.palette}>
            <h4 style={styles.paletteTitle}>Question Palette</h4>
            
            <div style={styles.paletteGrid}>
              {questions.map((q, index) => {
                const answered = answers[q._id] !== undefined;
                const review = markedForReview.includes(q._id);
                const current = currentQuestion === index;
                
                let bg = "#F1F5F9";
                let color = "#475569";
                
                if (answered) { bg = "#10B981"; color = "#FFFFFF"; }
                if (review) { bg = "#F59E0B"; color = "#FFFFFF"; }
                if (current) { bg = "#2563EB"; color = "#FFFFFF"; }

                return (
                  <button
                    key={q._id}
                    style={{
                      ...styles.paletteButton,
                      background: bg,
                      color: color,
                      boxShadow: current ? "0 0 0 3px #BFDBFE" : "none"
                    }}
                    onClick={() => setCurrentQuestion(index)}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>

            <div style={styles.legend}>
              <div style={styles.legendItem}><span style={{...styles.legendDot, background: "#2563EB"}}></span> Current</div>
              <div style={styles.legendItem}><span style={{...styles.legendDot, background: "#10B981"}}></span> Answered</div>
              <div style={styles.legendItem}><span style={{...styles.legendDot, background: "#F59E0B"}}></span> Review</div>
              <div style={styles.legendItem}><span style={{...styles.legendDot, background: "#F1F5F9", border: "1px solid #CBD5E1"}}></span> Unanswered</div>
            </div>

            <div style={styles.summaryBox}>
              <div style={styles.summaryRow}>
                <span>Answered</span>
                <strong style={{ color: "#10B981" }}>{answeredCount}</strong>
              </div>
              <div style={styles.summaryRow}>
                <span>Marked for Review</span>
                <strong style={{ color: "#F59E0B" }}>{reviewCount}</strong>
              </div>
              <div style={styles.summaryRow}>
                <span>Remaining</span>
                <strong style={{ color: "#64748B" }}>{remainingCount}</strong>
              </div>
            </div>

            <button 
              style={{ ...styles.submitBtn, opacity: submitting ? 0.6 : 1 }} 
              disabled={submitting} 
              onClick={handleSubmitExam}
              className="btn-hover"
            >
              <Send size={16} />
              {submitting ? "Submitting..." : "Submit Exam"}
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

/* ---------------- STYLES ---------------- */
const styles = {
  loadingContainer: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#F8FAFC",
  },
  spinner: {
    width: 36,
    height: 36,
    border: "3px solid #E2E8F0",
    borderTopColor: "#2563EB",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: 16,
  },

  page: {
    minHeight: "100vh",
    background: "#F8FAFC",
    padding: "24px 32px",
    maxWidth: 1350,
    margin: "0 auto",
  },

  header: {
    padding: "20px 28px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  examTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 700,
    color: "#0F172A",
    letterSpacing: "-0.02em",
  },
  examSubject: {
    margin: "4px 0 0 0",
    fontSize: 13,
    color: "#64748B",
    fontWeight: 500,
  },
  examInfo: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  infoChip: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "#F8FAFC",
    padding: "8px 14px",
    borderRadius: 8,
    border: "1px solid #E2E8F0",
    fontSize: 13,
    fontWeight: 600,
    color: "#475569",
  },
  timerChip: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#2563EB",
    color: "#FFFFFF",
    padding: "8px 16px",
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 700,
  },

  body: {
    display: "grid",
    gridTemplateColumns: "1fr 340px",
    gap: 24,
  },

  questionSection: {
    padding: 32,
    minHeight: "560px",
    display: "flex",
    flexDirection: "column",
  },
  questionSectionTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  questionCounter: {
    fontSize: 12,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "#64748B",
  },
  progressContainer: {
    marginTop: 12,
    marginBottom: 24,
    height: 6,
    background: "#F1F5F9",
    borderRadius: 999,
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    background: "#2563EB",
    borderRadius: 999,
    transition: "width 0.3s ease",
  },
  questionText: {
    margin: "0 0 24px 0",
    fontSize: 18,
    fontWeight: 600,
    color: "#0F172A",
    lineHeight: 1.5,
  },
  
  optionsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
    flex: 1,
  },
  optionCard: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "16px 20px",
    border: "1px solid",
    borderRadius: 12,
    cursor: "pointer",
  },
  optionCircle: {
    width: 30,
    height: 30,
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: 700,
    fontSize: 13,
    flexShrink: 0,
  },

  buttonRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 32,
    paddingTop: 20,
    borderTop: "1px solid #F1F5F9",
  },
  secondaryBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    padding: "10px 18px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 13,
    color: "#0F172A",
  },
  reviewBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    border: "1px solid",
    padding: "10px 18px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 13,
  },
  primaryBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "#2563EB",
    color: "#FFFFFF",
    border: "none",
    padding: "10px 22px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 13,
  },

  palette: {
    padding: 24,
    display: "flex",
    flexDirection: "column",
    height: "fit-content",
  },
  paletteTitle: {
    margin: "0 0 16px 0",
    fontSize: 15,
    fontWeight: 600,
    color: "#0F172A",
  },
  paletteGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: 10,
    marginBottom: 20,
  },
  paletteButton: {
    height: 40,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 13,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  legend: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    paddingBottom: 16,
    borderBottom: "1px solid #F1F5F9",
    marginBottom: 16,
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 12,
    color: "#64748B",
    fontWeight: 500,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    flexShrink: 0,
  },
  summaryBox: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    padding: 16,
    background: "#F8FAFC",
    borderRadius: 12,
    border: "1px solid #E2E8F0",
    marginBottom: 20,
    fontSize: 13,
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    color: "#475569",
  },
  submitBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    padding: 14,
    border: "none",
    borderRadius: 10,
    background: "#2563EB",
    color: "#FFFFFF",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 14,
  },
};

export default StudentExam;