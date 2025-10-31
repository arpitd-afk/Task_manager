import api from "@/lib/api";

export const getNotifications = async () => {
  const response = await api.get("/getnotification");
  return response;
};

export const addNotifications = async (data) => {
  const response = await api.post("/addnotification", data);
  return response;
};

export const updateNotifications = async (id, data) => {
  const response = await api.put(`/updatenotification/${id}`, data);
  return response;
};

export const deleteNotifications = async (id) => {
  const response = await api.delete(`/deletenotification/${id}`);
  return response;
};
