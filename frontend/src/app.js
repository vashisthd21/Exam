import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Register from './pages/register.js';
import login from './pages/login';
import Quiz from './pages/Quiz';

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