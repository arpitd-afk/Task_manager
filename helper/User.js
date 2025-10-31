import api from "@/lib/api";

export const getAllUsers = async () => {
  const response = await api.get("/allusers");
  return response;
};

export const getUserByID = async (userId) => {
  const response = await api.get(`/user/${userId}`);
  return response;
};

export const getCurrentUser = async () => {
  const response = await api.get("/me");
  return response;
};

export const getUserByRole = async () => {
  const response = await api.get("/mebyrole");
  return response;
};

export const updateUser = async (userId, formData) => {
  const response = await api.put(`/updateuser/${userId}`, formData);
  return response;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/deleteuser/${id}`);
  return response;
};
