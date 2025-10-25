import api from "@/lib/api";

export const getAllTickets = async () => {
  return await api.get("/getalltickets");
};

export const addTicket = async (data) => {
  return await api.post("/addticket", data);
};

export const getTicketByID = async () => {
  return await api.get(`/getticket/${id}`);
};

export const updateTicket = async (id, data) => {
  return await api.put(`/updateticket/${id}`, data);
};

export const deleteTicket = async (id) => {
  return await api.delete(`/deleteticket/${id}`);
};
