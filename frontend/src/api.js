import axios from "axios";

const API = axios.create({
  // baseURL: import.meta.env.VITE_API_BASE_URL,
  baseURL: 'https://exam-86ot.onrender.com',
  withCredentials: true
});

export default API;
