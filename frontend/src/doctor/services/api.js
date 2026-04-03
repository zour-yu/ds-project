import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api",
});

export const getDoctors = () => API.get("/doctors");

export const getDoctorById = (id) => API.get(`/doctors/${id}`);

export const getDoctorAvailability = (id) =>
  API.get(`/doctors/${id}/availability`);