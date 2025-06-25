import { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function Quiz() {
  const [quiz, setQuiz] = useState({});
  const [subjects, setSubjects] = useState([]); // list of subjects
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // store answers
  const userId = '123abc';

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/quiz/start');
        setQuiz(response.data);
        setSubjects(Object.keys(response.data));
        setCurrentSubjectIndex(0);
        setCurrentQuestionIndex(0);
      } catch (error) {
        console.log('Error fetching QUIZ', error);
      }
    };

    fetchQuiz();

    const handleTabSwitch = () => {
      if (document.hidden) {
        socket.emit('userLeft', { userId });
        alert('You have switched tabs!!');
      }
    };

    document.addEventListener('visibilitychange', handleTabSwitch);

    return () => {
      document.removeEventListener('visibilitychange', handleTabSwitch);
    };
  }, []);

  if (subjects.length === 0) return <p>Loading quiz...</p>;

  const currentSubject = subjects[currentSubjectIndex];
  const questions = quiz[currentSubject];
  const currentQuestion = questions[currentQuestionIndex];

  const totalQuestions = subjects.reduce((total, sub) => total + quiz[sub].length, 0);
  const questionNumber =
    subjects
      .slice(0, currentSubjectIndex)
      .reduce((sum, sub) => sum + quiz[sub].length, 0) + currentQuestionIndex + 1;

  const handleAnswerSelect = (option) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [`${currentSubject}-${currentQuestionIndex}`]: option,
    });
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
      const prevSubjectIndex = currentSubjectIndex - 1;
      const prevSubjectQuestions = quiz[subjects[prevSubjectIndex]].length;
      setCurrentSubjectIndex(prevSubjectIndex);
      setCurrentQuestionIndex(prevSubjectQuestions - 1);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Quiz - {currentSubject}</h1>
      <div style={styles.questionBox}>
        <p style={styles.questionNumber}>
          Question {questionNumber} of {totalQuestions}
        </p>
        <p style={styles.questionText}>{currentQuestion.question}</p>
        <div style={styles.options}>
          {currentQuestion.options.map((opt, idx) => (
            <label key={idx} style={styles.optionLabel}>
              <input
                type="radio"
                name={`question-${currentSubject}-${currentQuestionIndex}`}
                value={opt}
                checked={selectedAnswers[`${currentSubject}-${currentQuestionIndex}`] === opt}
                onChange={() => handleAnswerSelect(opt)}
                style={styles.radioInput}
              />
              {opt}
            </label>
          ))}
        </div>
      </div>
      <div style={styles.buttons}>
        <button
          onClick={goPrev}
          disabled={questionNumber === 1}
          style={{ ...styles.navButton, opacity: questionNumber === 1 ? 0.5 : 1 }}
        >
          Previous
        </button>
        <button
          onClick={goNext}
          disabled={questionNumber === totalQuestions}
          style={{ ...styles.navButton, opacity: questionNumber === totalQuestions ? 0.5 : 1 }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: '30px auto',
    fontFamily: 'Arial, sans-serif',
    padding: 20,
    border: '2px solid #007bff',
    borderRadius: 10,
    backgroundColor: '#f9faff',
  },
  questionBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
    marginBottom: 20,
  },
  questionNumber: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 16,
    color: '#555',
  },
  questionText: {
    fontSize: 20,
    marginBottom: 15,
  },
  options: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  optionLabel: {
    backgroundColor: '#e7f1ff',
    padding: '10px 15px',
    borderRadius: 6,
    cursor: 'pointer',
    userSelect: 'none',
    fontSize: 16,
  },
  radioInput: {
    marginRight: 10,
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  navButton: {
    padding: '10px 20px',
    fontSize: 16,
    borderRadius: 6,
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
  },
};
