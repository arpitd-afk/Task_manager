import api from "@/lib/api";

export const getNotifications = async () => {
  return await api.get("/getnotification");
};

export const addNotifications = async (data) => {
  return await api.post("/addnotification", data);
};

export const updateNotifications = async (id, data) => {
  return await api.put(`/updatenotification/${id}`, data);
};

export const deleteNotifications = async (id) => {
  return await api.delete(`/deletenotification/${id}`);
};
