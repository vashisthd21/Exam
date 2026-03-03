import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Quiz from "./pages/Quiz.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import ResultAnalysis from "./pages/ResultAnalysis";
import AdminDashboard from "./pages/AdminDashboard";
import VerifyOTP from "./pages/VerifyOTP.jsx";

function App() {
  return (
      <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/quiz/:quizType" element={<Quiz />} />
          <Route
  path="/result-analysis/:attemptId"
  element={<ResultAnalysis />}
/>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
        </Routes>
      </div>
  );
}

export default App;
