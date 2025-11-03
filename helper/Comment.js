import api from "@/lib/api";

export const getCommentByTicket = async (ticketId) => {
  if (!ticketId) {
    return console.error("Ticket ID not found");
  }
  const response = await api.get(`/getcommbyticket/${ticketId}`);
  return response;
};

export const addcomment = async (comment_text, ticket_id) => {
  if ((!ticket_id, !comment_text)) {
    return console.error("Credentials not found");
  }
  const response = await api.post("/addcomment", comment_text, ticket_id);
  return response;
};

export const updateComment = async (editingCommentId, comment_text) => {
  if ((!editingCommentId, !comment_text)) {
    return console.error("Credentials not found");
  }
  const response = await api.put(
    `/editcomment/${editingCommentId}`,
    comment_text
  );
  return response;
};

export const deleteComment = async (commentId) => {
  if (!commentId) {
    return console.error("Comment ID not found");
  }
  const response = await api.delete(`/deletecomment/${commentId}`);
  return response;
};

export const getCommentReply = async (commentId) => {
  if (!commentId) {
    return console.error("Comment ID not found");
  }
  const response = await api.get(`/getrepliesbycomment/${commentId}`);
  return response;
};

export const addcommentReply = async (commentId, reply_text) => {
  if ((!commentId, !reply_text)) {
    return console.error("Credentials not found");
  }
  const response = await api.post(`/replycomment/${commentId}`, reply_text);
  return response;
};

export const updateCommentReply = async (commentId, reply_text) => {
  if ((!commentId, !reply_text)) {
    return console.error("Credentials not found");
  }
  const response = await api.put(`/editreply/${commentId}`, reply_text);
  return response;
};

export const deleteCommentReply = async (replyId) => {
  if (!replyId) {
    return console.error("Reply ID not found");
  }
  const response = await api.delete(`/deletereply/${replyId}`);
  return response;
};
