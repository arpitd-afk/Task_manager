import api from "@/lib/api";

export const getCommentByTicket = async (ticketId) => {
  return await api.get(`/getcommbyticket/${ticketId}`);
};

export const addcomment = async (data) => {
  return await api.post("/getcommbyticket", data);
};

export const updateComment = async (editingCommentId, data) => {
  return await api.put(`/editcomment/${editingCommentId}`, data);
};

export const deleteComment = async (commentId) => {
  return await api.delete(`/deletecomment/${commentId}`);
};

export const getCommentReply = async (commentId) => {
  return await api.get(`/getrepliesbycomment/${commentId}`);
};

export const addcommentReply = async (data, commentId) => {
  return await api.post(`/replycomment/${commentId}`, data);
};

export const updateCommentReply = async (id, data) => {
  return await api.put(`/editreply/${id}`, data);
};

export const deleteCommentReply = async (id) => {
  return await api.delete(`/deletereply/${id}`);
};
