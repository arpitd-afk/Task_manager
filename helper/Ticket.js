import api from "@/lib/api";

export const getAllTickets = async () => {
  const response = await api.get("/getalltickets");
  return response;
};

export const addTicket = async (formData) => {
  const response = await api.post("/addticket", formData);
  return response;
};

export const getTicketByID = async (ticketId) => {
  const response = await api.get(`/getticket/${ticketId}`);
  return response;
};

export const updateTicket = async (ticketId, formData) => {
  const response = await api.put(`/updateticket/${ticketId}`, formData);
  return response;
};

export const deleteTicket = async (id) => {
  const response = await api.delete(`/deleteticket/${id}`);
  return response;
};
