import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api",
});

export const getDoctors = () => API.get("/doctors");

export const getDoctorById = (id) => API.get(`/doctors/${id}`);

export const getDoctorAvailability = (id) =>
  API.get(`/doctors/${id}/availability`);

export const createAppointment = (data) =>
  axios.post("http://localhost:5002/api/appointments", data);


API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;