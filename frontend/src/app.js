import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Register from './pages/Register.jsx';
import login from './pages/login.jsx';
import Quiz from './pages/Quiz.jsx';

function App() {
    return (
        <BrowserRouter>
        <Routes>
            <Route path ="/register" element={<Register />}/>
            <Route path = "/login" element={<login />}/>
            <Route path ="/quiz" element={<Quiz />}/>
        </Routes>
        </BrowserRouter>
    );
}

export default App;