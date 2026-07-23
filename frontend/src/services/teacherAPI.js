import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5001",
  withCredentials: true,
});

// ==========================================
// Attach JWT Automatically
// ==========================================

API.interceptors.request.use((config) => {

  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ==========================================
// Teacher API
// ==========================================

const teacherApi = {

  // ---------------- Dashboard ----------------

  getDashboard() {
    return API.get("/api/teacher/dashboard");
  },

  // ---------------- Exams ----------------

  getAllExams() {
    return API.get("/api/teacher/exams");
  },

  getExamById(id) {
    return API.get(`/api/teacher/exam/${id}`);
  },

  createExam(data) {
    return API.post("/api/teacher/exam", data);
  },

  updateExam(id, data) {
    return API.put(`/api/teacher/exam/${id}`, data);
  },

  deleteExam(id) {
    return API.delete(`/api/teacher/exam/${id}`);
  },

  publishExam(id) {
    return API.patch(`/api/teacher/exam/publish/${id}`);
  },

  unpublishExam(id) {
    return API.patch(`/api/teacher/exam/unpublish/${id}`);
  },

  // ---------------- AI Generation ----------------

  generateAIQuestions(examId, data) {
    return API.post(
      `/api/teacher/exam/${examId}/generate`,
      data
    );
  },

  // ---------------- Question Bank ----------------

  getQuestionBank() {
    return API.get("/api/question");
  },

  createQuestion(data) {
    return API.post("/api/question", data);
  },

  updateQuestion(id, data) {
    return API.put(`/api/question/${id}`, data);
  },

  deleteQuestion(id) {
    return API.delete(`/api/question/${id}`);
  },
};

export default teacherApi;