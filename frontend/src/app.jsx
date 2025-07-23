import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register.jsx';
import Login from './pages/login.jsx';
import LandingPage from './pages/LandingPage.jsx'; 
import Dashboard from './pages/Dashboard.jsx';  // Import Dashboard
import Quiz from './pages/Quiz.jsx';
import ContactUs from './pages/ContactUs.jsx'; // Import ContactUs page
function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<LandingPage/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />  {/* Dashboard route */}
          <Route path="/quiz/:quizType" element={<Quiz />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
