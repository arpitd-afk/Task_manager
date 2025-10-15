import axios from "axios";
import Cookies from "js-cookie";
import api from "@/lib/api";

const API_BASE = process.env.API_BASE_URL || "http://localhost:5000/api";
axios.defaults.withCredentials = true;

export const signupUser = async (data) => {
  const res = await axios.post(`${API_BASE}/signup`, data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await api.post(`${API_BASE}/login`, data, {
    withCredentials: true,
  });
  if (res.data.token) {
    localStorage.setItem("token", res.data.token, {
      secure: true,
      sameSite: "strict",
    });
    axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
  } else {
    throw new Error("Token not received from server.");
  }
  return res.data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  delete axios.defaults.headers.common["Authorization"];
};
