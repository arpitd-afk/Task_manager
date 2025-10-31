import api from "@/lib/api";

export const getAllTasks = async () => {
  const response = await api.get("/getalltasks");
  return response;
};

export const getTaskById = async (id) => {
  const response = await api.get(`/gettask/${id}`);
  return response;
};

export const getTasksByTicket = async (ticketId) => {
  const response = await api.get(`/taskbyticket/${ticketId}`);
  return response;
};

export const addTask = async (payload) => {
  const response = await api.post("/addtask", payload);
  return response;
};

export const updateTask = async (id, payload) => {
  const response = await api.put(`/updatetask/${id}`, payload);
  return response;
};

export const deleteTask = async (id) => {
  const response = await api.delete(`/deletetask/${id}`);
  return response;
};
