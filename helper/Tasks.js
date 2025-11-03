import api from "@/lib/api";

export const getAllTasks = async () => {
  const response = await api.get("/getalltasks");
  return response;
};

export const getTaskById = async (id) => {
  if (!id) {
    return console.error("Task ID not found");
  }
  const response = await api.get(`/gettask/${id}`);
  return response;
};

export const getTasksByTicket = async (ticketId) => {
  if (!ticketId) {
    return console.error("Ticket ID not found");
  }
  const response = await api.get(`/taskbyticket/${ticketId}`);
  return response;
};

export const addTask = async (payload) => {
  if (!payload) {
    return console.error("Error getting payload data");
  }
  const response = await api.post("/addtask", payload);
  return response;
};

export const updateTask = async (id, payload) => {
  if ((!id, !payload)) {
    return console.error("Error geting id and payload data");
  }
  const response = await api.put(`/updatetask/${id}`, payload);
  return response;
};

export const deleteTask = async (id) => {
  if (!id) {
    return console.error("Task ID not found");
  }
  const response = await api.delete(`/deletetask/${id}`);
  return response;
};
