import {useEffect, useState} from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

//tries different approach
// const Quiz = ()=> {

// }

export default function Quiz() {
    const [quiz, setQuiz] = useState({});
    const userId = '123abc';

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/quiz/start');
                setQuiz(response.data);
            } catch (error) {
                console.log('Error fetvhing QUIZ', error);
            };
            fetchQuiz();

            const handleTabSwitch = () => {
                if(document.hidden) {
                    socket.emit('userLeft', {userId});
                    alert('You have switched tabs!!');
                }
            };

            document.addEventListener('visibilitychange', handleTabSwitch);
        };
    }, []);

    return (
        <div>
            <h1>Quiz Started</h1>
            { Object.keys(quiz).map(subject => 
                quiz[subject].map((q, i) => (
                    <div key = {i}>
                        <p>{q.question}</p>
                        {q.options.map((opt, idx) => (
                            <div key = {idx}>
                                <input type = "radio" name ={`${subject} - ${i}`}/> {opt}
                                </div>
                        ))}
                    </div>
                ))
            )}
        </div>
    );
}