import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_DOCTOR_API
});

// 🔥 TEMP FAKE TOKEN (CHANGE LATER)
const getToken = () => {
  return "FAKE_TOKEN"; 
};

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;