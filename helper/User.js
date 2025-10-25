import api from "@/lib/api";

export const getAllUsers = async () => {
  return await api.get("/allusers");
};

export const getUserByID = async () => {
  return await api.get(`/user/${id}`);
};

export const getCurrentUser = async () => {
  return await api.get("/me");
};

export const getUserByRole = async () => {
  return await api.get("/mebyrole");
};

export const updateUser = async (id, data) => {
  return await api.put(`/updateuser/${id}`, data);
};

export const deleteUser = async (id) => {
  return await api.delete(`/deleteuser/${id}`);
};
