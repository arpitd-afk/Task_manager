import api from "@/lib/api";

export const getAllTickets = async () => {
  const response = await api.get(`/getalltickets`);
  return response;
};

export const addTicket = async (formData) => {
  if (!formData) throw new Error("Error getting formdata");
  const response = await api.post("/addticket", formData);
  return response;
};

export const getTicketByID = async (ticketId) => {
  if (!ticketId) throw new Error("Ticket ID is required");
  const response = await api.get(`/getticket/${ticketId}`);
  return response;
};

export const updateTicket = async (ticketId, formData) => {
  if (!ticketId || !formData) throw new Error("Ticket ID and data required");
  const response = await api.put(`/updateticket/${ticketId}`, formData);
  return response;
};

export const deleteTicket = async (id) => {
  if (!id) throw new Error("Ticket ID is required");
  const response = await api.delete(`/deleteticket/${id}`);
  return response;
};
