import axios from "axios";
import { auth } from "../../config/firebase";

const API = axios.create({
  baseURL: import.meta.env.VITE_AI_SYMPTOM_API || "http://localhost:5007/api/ai-symptoms"
});

API.interceptors.request.use(async (config) => {
  try {
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Error getting AI symptom token:", error);
  }

  return config;
});

export const analyzeSymptoms = async (payload) => {
  const response = await API.post("/analyze", payload);
  return response.data;
};

export const fetchAssessmentHistory = async (patientId) => {
  const response = await API.get("/history", {
    params: patientId ? { patientId } : {}
  });
  return response.data;
};

export default API;
