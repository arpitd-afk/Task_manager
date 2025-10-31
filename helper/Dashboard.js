import api from "@/lib/api";

export const getTicketSummary = async () => {
  const response = await api.get("/tickets/summary");
  return response;
};

export const getTicketPriority = async () => {
  const response = await api.get("/tickets/priority");
  return response;
};

export const getTaskStatus = async () => {
  const response = await api.get("/tasks/status");
  return response;
};
