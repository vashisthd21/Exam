import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { debounce } from 'lodash';
import CameraFeed from './CameraFeed';

const socket = io('https://exam-86ot.onrender.com');

export default function Quiz() {
  const [quiz, setQuiz] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const QUESTION_TIME = 30; // 30 for test purpose
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [timeUp, setTimeUp] = useState(false);

  const userId = '123abc'; 
  const { quizType } = useParams();

  const goToDashboard = () => {
    window.location.href = '/dashboard';
  };

  const handleTabSwitchRef = useRef();

  useEffect(() => {
    // Reset states when quizType changes
    setQuiz({});
    setSubjects([]);
    setCurrentSubjectIndex(0);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(0);
    setTabSwitchCount(0);
    setLoading(true);
    setTimeLeft(QUESTION_TIME);
    setTimeUp(false);

    const fetchQuiz = async () => {
      try {
        console.log('Fetching quiz for quizType:', quizType);

        const token = localStorage.getItem('token');
        const response = await axios.get('https://exam-86ot.onrender.com/api/quiz/start', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          params: { quizType },
          withCredentials: true,
        });

        let data = response.data;

        // Agar data array hai (flat questions array), to group by subject
        if (Array.isArray(data)) {
          const grouped = data.reduce((acc, question) => {
            const subject = question.subject || 'General';
            if (!acc[subject]) acc[subject] = [];
            acc[subject].push(question);
            return acc;
          }, {});
          data = grouped;
        }

        console.log('Quiz grouped by subject:', data);

        setQuiz(data);
        setSubjects(Object.keys(data));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching quiz:', error);
        setLoading(false);
      }
    };

    fetchQuiz();

    // Debounced tab switch handler
    handleTabSwitchRef.current = debounce(() => {
      if (document.hidden) {
        setTabSwitchCount((prevCount) => {
          const newCount = prevCount + 1;

          if (newCount === 1 || newCount === 2) {
            socket.emit('userLeft', { userId });
            alert(`You have switched tabs ${newCount} time(s). Please stay on the quiz page to avoid disqualification.`);
          } else if (newCount === 3) {
            handleSubmit();
          }

          return newCount;
        });
      }
    }, 1000);

    document.addEventListener('visibilitychange', handleTabSwitchRef.current);

    return () => {
      if (handleTabSwitchRef.current) {
        document.removeEventListener('visibilitychange', handleTabSwitchRef.current);
        handleTabSwitchRef.current.cancel();
      }
    };
  }, [quizType]); 

  const currentSubject = subjects[currentSubjectIndex];
  const questions = quiz[currentSubject] || [];
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    //Enter the full screen
    const goFullscreen = () => {
      const doce1 = document.documentElement; // js to enter full screen
      if(doce1.requestFullscreen)
          doce1.requestFullscreen();
      else if(doce1.webkitRequestFullscreen) 
          doce1.webkitRequestFullscreen();
      else if(doce1.msRequestFullscreen)
          doce1.msRequestFullscreen();
    }

    goFullscreen();

    //Get permission for cam and mic
    // const requestMediaPermissions = async() => {
    //   try {
    //     const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
    //     //Optional: attach to a hidden videos for preview
    //     const videoElement = document.createElement('video');
    //     videoElement.srcObject = stream;
    //     videoElement.muted = true;
    //     videoElement.autoplay =true;
    //     videoElement.style.diplay = 'none';
    //     document.body.appendChild(videoElement);
    //   } catch(err) {
    //     alert('Camera and mic permissions are required');
    //     socket.emit('permission-denied', {userId});
    //   }
    // };

    // requestMediaPermissions();

    //If exit fullscreen
    document.addEventListener("fullscreenchange", () => {
      if(!document.fullscreenElement) {
        alert("You exited fullscreen!");
        socket.emit('fullscreen-exit', {userId});
      }
    });

    setTimeLeft(QUESTION_TIME);
    setTimeUp(false);

    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          setTimeUp(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [currentSubjectIndex, currentQuestionIndex]);

  const handleAnswerSelect = (qid, selectedOption) => {
    if (timeUp || submitted || submitting) return; 
    setAnswers((prev) => {
      const filtered = prev.filter((ans) => ans.qid !== qid);
      return [...filtered, { qid, answer: selectedOption }];
    });

    setSelectedAnswers((prev) => ({
      ...prev,
      [`${currentSubject}-${currentQuestionIndex}`]: selectedOption,
    }));
  };

  const goNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentSubjectIndex < subjects.length - 1) {
      setCurrentSubjectIndex(currentSubjectIndex + 1);
      setCurrentQuestionIndex(0);
    }
  };

  const goPrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentSubjectIndex > 0) {
      const prevSubIndex = currentSubjectIndex - 1;
      const prevSubQuestions = quiz[subjects[prevSubIndex]] || [];
      setCurrentSubjectIndex(prevSubIndex);
      setCurrentQuestionIndex(prevSubQuestions.length - 1);
    }
  };

  const handleSubmit = async () => {
    if (submitting) return; // Prevent duplicate submits
    setSubmitting(true);
    console.log('Submitting answers:', answers);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://exam-86ot.onrender.com/api/quiz/submit',
        { userId, answers },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        }
      );

      setSubmitted(true);
      setScore(response.data.score);
      alert('Quiz submitted successfully');
    } catch (error) {
      console.log('Error submitting quiz:', error);
      alert('Error submitting quiz!');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p style={styles.loading}>Loading quiz...</p>;
  }

  if (!subjects.length || !questions.length) {
    return <p style={styles.loading}>No questions available</p>;
  }

  if (!currentQuestion) {
    return <p style={styles.loading}>No question found.</p>;
  }

  const totalQuestions = subjects.reduce(
    (total, sub) => total + (quiz[sub]?.length || 0),
    0
  );

  const questionNumber =
    subjects
      .slice(0, currentSubjectIndex)
      .reduce((sum, sub) => sum + (quiz[sub]?.length || 0), 0) +
    currentQuestionIndex +
    1;

  if (submitted) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.resultBox}>
          <h2 style={{ marginBottom: 20 }}>Quiz Submitted!</h2>
          <p style={{ fontSize: 20, marginBottom: 30 }}>
            Your Score: <strong>{score}</strong> / {totalQuestions}
          </p>
          <button onClick={goToDashboard} style={styles.dashboardButton}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <h1 style={styles.subjectTitle}>Quiz - {currentSubject}</h1>
        <div style={styles.questionBox}>
          <div style={styles.questionHeader}>
            <p style={styles.questionNumber}>
              Question {questionNumber} of {totalQuestions}
            </p>
            <div style={styles.timer}>
              Time left: {timeLeft}s
            </div>
          </div>
          <p style={styles.questionText}>{currentQuestion.question}</p>
          <div style={styles.options}>
            {currentQuestion.options.map((opt, idx) => (
              <label
                key={idx}
                style={{
                  ...styles.optionLabel,
                  backgroundColor:
                    selectedAnswers[`${currentSubject}-${currentQuestionIndex}`] === opt
                      ? '#5a67d8'
                      : '#eef2ff',
                  color:
                    selectedAnswers[`${currentSubject}-${currentQuestionIndex}`] === opt
                      ? 'white'
                      : '#2d3748',
                  cursor: timeUp || submitted || submitting ? 'not-allowed' : 'pointer',
                }}
              >
                <input
                  type="radio"
                  name={`question-${currentSubject}-${currentQuestionIndex}`}
                  value={opt}
                  checked={
                    selectedAnswers[`${currentSubject}-${currentQuestionIndex}`] === opt
                  }
                  onChange={() => handleAnswerSelect(currentQuestion._id, opt)}
                  style={styles.radioInput}
                  disabled={submitted || submitting || timeUp}
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
        <div style={styles.buttons}>
          <button
            onClick={goPrev}
            disabled={questionNumber === 1 || submitting}
            style={{
              ...styles.navButton,
              opacity: questionNumber === 1 ? 0.5 : 1,
              cursor: questionNumber === 1 ? 'not-allowed' : 'pointer',
            }}
          >
            Previous
          </button>
          <button
            onClick={goNext}
            disabled={questionNumber === totalQuestions || submitting}
            style={{
              ...styles.navButton,
              opacity: questionNumber === totalQuestions ? 0.5 : 1,
              cursor: questionNumber === totalQuestions ? 'not-allowed' : 'pointer',
            }}
          >
            Next
          </button>
          <button
            onClick={handleSubmit}
            style={{ ...styles.navButton, backgroundColor: '#38a169', marginLeft: 10 }}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
      <CameraFeed />
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: '95.5vh',
    maxHeight: '95.5vh',
    width: '94.5vw',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '5px 30px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    overflow: 'hidden',
  },
  container: {
    width: '100%',
    maxWidth: 640,
    height: '90vh',
    maxHeight: '93vh',
    overflowY: 'auto',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: '5px 30px',
    boxSizing: 'border-box',
    boxShadow: '0 15px 25px rgba(0,0,0,0.15)',
    display: 'flex',
    flexDirection: 'column',
  },
  subjectTitle: {
    fontSize: 28,
    fontWeight: 800,
    marginBottom: 20,
    color: '#2d3748',
    textAlign: 'center',
    flexShrink: 0,
  },
  questionBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 25,
    boxShadow: '0 8px 16px rgba(90, 103, 216, 0.15)',
    marginBottom: 25,
    flexShrink: 0,
  },
  questionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    color: '#718096',
    fontWeight: '700',
    fontSize: 16,
  },
  timer: {
    backgroundColor: '#5a67d8',
    color: 'white',
    padding: '4px 12px',
    borderRadius: 12,
    fontWeight: '700',
    fontSize: 14,
    userSelect: 'none',
    minWidth: 90,
    textAlign: 'center',
  },
  questionNumber: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 0,
    color: '#718096',
  },
  questionText: {
    fontSize: 22,
    marginBottom: 20,
    color: '#2d3748',
  },
  options: {
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
  },
  optionLabel: {
    padding: '12px 18px',
    borderRadius: 10,
    cursor: 'pointer',
    fontSize: 17,
    userSelect: 'none',
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.3s ease, color 0.3s ease',
  },
  radioInput: {
    marginRight: 15,
    cursor: 'pointer',
    transform: 'scale(1.2)',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    gap: 15,
    flexShrink: 0,
  },
  navButton: {
    padding: '14px 28px',
    fontSize: 18,
    borderRadius: 12,
    border: 'none',
    backgroundColor: '#5a67d8',
    color: 'white',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 8px 15px rgba(90, 103, 216, 0.4)',
    transition: 'all 0.3s ease',
  },
  loading: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: '#eee',
  },
  resultBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 40,
    borderRadius: 20,
    textAlign: 'center',
    boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
    color: '#2d3748',
  },
  dashboardButton: {
    marginTop: 20,
    padding: '12px 24px',
    fontSize: 18,
    fontWeight: 700,
    color: 'white',
    backgroundColor: '#48bb78',
    border: 'none',
    borderRadius: 12,
    cursor: 'pointer',
    boxShadow: '0 8px 15px rgba(72, 187, 120, 0.5)',
  },
};
