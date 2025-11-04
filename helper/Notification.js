import api from "@/lib/api";

export const getNotifications = async () => {
  const response = await api.get("/getnotification");
  return response;
};

export const addNotifications = async (data) => {
  if (!data) throw new Error("Data is required");
  const response = await api.post("/addnotification", data);
  return response;
};

export const updateNotifications = async (id, data) => {
  if (!id) throw new Error("Notification ID and data is required");
  const response = await api.put(`/updatenotification/${id}`, data);
  return response;
};

export const deleteNotifications = async (id) => {
  if (!id) throw new Error("Notification ID is required");
  const response = await api.delete(`/deletenotification/${id}`);
  return response;
};
