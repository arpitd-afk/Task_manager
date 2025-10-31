import api from "@/lib/api";

export const getCommentByTicket = async (ticketId) => {
  const response = await api.get(`/getcommbyticket/${ticketId}`);
  return response;
};

export const addcomment = async (comment_text, ticket_id) => {
  const response = await api.post("/addcomment", comment_text, ticket_id);
  return response;
};

export const updateComment = async (editingCommentId, comment_text) => {
  const response = await api.put(
    `/editcomment/${editingCommentId}`,
    comment_text
  );
  return response;
};

export const deleteComment = async (commentId) => {
  const response = await api.delete(`/deletecomment/${commentId}`);
  return response;
};

export const getCommentReply = async (commentId) => {
  const response = await api.get(`/getrepliesbycomment/${commentId}`);
  return response;
};

export const addcommentReply = async (commentId, reply_text) => {
  const response = await api.post(`/replycomment/${commentId}`, reply_text);
  return response;
};

export const updateCommentReply = async (commentId, reply_text) => {
  const response = await api.put(`/editreply/${commentId}`, reply_text);
  return response;
};

export const deleteCommentReply = async (replyId) => {
  const response = await api.delete(`/deletereply/${replyId}`);
  return response;
};
