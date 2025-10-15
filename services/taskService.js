import axios from "axios";
import Cookies from "js-cookie";

const API_BASE = process.env.API_BASE_URL || "http://localhost:5000/api";

const getAuthHeader = () => {
  const token = Cookies.get("tokenfromfron");
  return {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  };
};

export const fetchTasks = async () => {
  return await axios.get(`${API_BASE}/mytasks`, getAuthHeader());
};

export const addTask = async (data) => {
  return await axios.post(`${API_BASE}/addtask`, data, getAuthHeader());
};

export const updateTask = async (id, data) => {
  return await axios.put(`${API_BASE}/updatetask/${id}`, data, getAuthHeader());
};

export const deleteTask = async (id) => {
  return await axios.delete(`${API_BASE}/deletetask/${id}`, getAuthHeader());
};

export const getUserInfo = async () => {
  return await axios.get(`${API_BASE}/me`, getAuthHeader());
};
