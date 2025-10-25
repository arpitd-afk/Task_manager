import axios from "axios";
import api from "@/lib/api";

// const API_BASE = process.env.API_BASE_URL || "http://localhost:5000/api";
axios.defaults.withCredentials = true;

export const signupUser = async (data) => {
  const res = await api.post("/signup", data);
  return res.data;
};

export const loginUser = async (formData) => {
  const res = await api.post("/login", formData);
  // try {
  //   const res = await api.post("/login", data, {
  //     withCredentials: true,
  //   });
  //   if (res.data.token) {
  //     localStorage.setItem("token", res.data.token, {
  //       secure: true,
  //       sameSite: "strict",
  //     });
  //     axios.defaults.headers.common[
  //       "Authorization"
  //     ] = `Bearer ${res.data.token}`;
  //   } else {
  //     throw new Error("Token not received from server.");
  //   }
  // } catch (error) {
  //   console.log("Unable to Complete The Authorization Process", error);
  // }
  return res.formData;
};

export const getUserInfo = async () => {
  return await api.get("/me");
};
