import axios from "axios";

const API = "http://localhost:5001/api/auth";

export const registerDoctor = (data) =>
  axios.post(`${API}/register`, data);

export const loginDoctor = (data) =>
  axios.post(`${API}/login`, data);