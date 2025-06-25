import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register.jsx';
import Login from './pages/login.jsx';
import Dashboard from './pages/Dashboard.jsx';  // Import Dashboard
import Quiz from './pages/Quiz.jsx';

function App() {
  return (
    <BrowserRouter>
      <div>
        {/* <h1 style={{ textAlign: 'center' }}>Welcome to Secure Exam App</h1> */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />  {/* Dashboard route */}
          <Route path="/quiz" element={<Quiz />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
