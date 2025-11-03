import api from "@/lib/api";

export const getNotifications = async () => {
  const response = await api.get("/getnotification");
  return response;
};

export const addNotifications = async (data) => {
  if (!data) {
    return console.error("Error getting data");
  }
  const response = await api.post("/addnotification", data);
  return response;
};

export const updateNotifications = async (id, data) => {
  if ((!id, !data)) {
    return console.error("Error getting id, data");
  }
  const response = await api.put(`/updatenotification/${id}`, data);
  return response;
};

export const deleteNotifications = async (id) => {
  if (!id) {
    return console.error("Notification ID not found");
  }
  const response = await api.delete(`/deletenotification/${id}`);
  return response;
};
