import api from "@/lib/api";

export const getAllTasks = async () => {
  const response = await api.get(`/getalltasks`);
  return response;
};

export const getTaskById = async (id) => {
  if (!id) throw new Error("Task ID is required");
  const response = await api.get(`/gettask/${id}`);
  return response;
};

export const getTasksByTicket = async (ticketId) => {
  if (!ticketId) throw new Error("Ticket ID is required");
  const response = await api.get(`/taskbyticket/${ticketId}`);
  return response;
};

export const addTask = async (payload) => {
  if (!payload) throw new Error("Payload data is required");
  const response = await api.post("/addtask", payload);
  return response;
};

export const updateTask = async (id, payload) => {
  if (!id || !payload) throw new Error("Task ID and payload data is required");
  const response = await api.put(`/updatetask/${id}`, payload);
  return response;
};

export const deleteTask = async (id) => {
  if (!id) throw new Error("Task ID is required");
  const response = await api.delete(`/deletetask/${id}`);
  return response;
};
