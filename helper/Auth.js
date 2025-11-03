import api from "@/lib/api";

export const signupUser = async (data) => {
  if (!data) {
    return console.error("Error getting data");
  }
  const res = await api.post("/signup", data);
  return res;
};

export const loginUser = async (formData) => {
  const res = await api.post("/login", formData);
  return res;
};
