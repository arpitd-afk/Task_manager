import api from "@/lib/api";

export const getTicketSummary = async () => {
  return await api.get("/tickets/summary");
};

export const getTicketPriority = async () => {
  return await api.get("/tickets/priority");
};

export const getTaskStatus = async () => {
  return await api.get("/tasks/status");
};
