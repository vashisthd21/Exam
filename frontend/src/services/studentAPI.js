import axios from "axios";

const API=axios.create({
baseURL:import.meta.env.VITE_API_BASE_URL,
withCredentials:true,
});

API.interceptors.request.use((config)=>{
const token=localStorage.getItem("token");
if(token){
config.headers.Authorization=`Bearer ${token}`;
}
return config;
});

const studentAPI={

getPublishedExams:()=>API.get("/api/quiz/student/exams"),

getExamById:(id)=>
API.get(`/api/quiz/student/exam/${id}`),

submitExam:(examId,data)=>
API.post(`/api/quiz/student/exam/${examId}/submit`,data),

getAttempt:(attemptId)=>
API.get(`/api/quiz/student/attempt/${attemptId}`),

};

export default studentAPI;