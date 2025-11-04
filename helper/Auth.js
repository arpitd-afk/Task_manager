import api from "@/lib/api";

export const signupUser = async (data) => {
  if (!data) throw new Error("Data is required");
  const res = await api.post("/signup", data);
  return res;
};

export const loginUser = async (formData) => {
  const res = await api.post("/login", formData);
  return res;
};
