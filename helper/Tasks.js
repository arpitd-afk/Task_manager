import api from "@/lib/api";

export const getAllTasks = async () => {
  return await api.get("/getalltasks");
};

export const getTaskById = async (id) => {
  return await api.get(`/gettask/${id}`);
};

export const getTasksByTicket = async (ticket_id) => {
  return await api.get(`/taskbyticket/${ticket_id}`);
};

export const addTask = async (data) => {
  return await api.post("/addtask", data);
};

export const updateTask = async (id, data) => {
  return await api.put(`/updatetask/${id}`, data);
};

export const deleteTask = async (id) => {
  return await api.delete(`/deletetask/${id}`);
};
