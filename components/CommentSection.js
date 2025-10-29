import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import api from "../lib/api";

export default function CommentSection({ ticketId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replies, setReplies] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingReply, setEditingReply] = useState({});
  const fetchComments = async () => {
    try {
      const res = await api.get(`/getcommbyticket/${ticketId}`);
      const commentsData = res.data.comments || [];
      const updatedComments = await Promise.all(
        commentsData.map(async (comment) => {
          const repliesRes = await api.get(
            `/getrepliesbycomment/${comment.id}`
          );
          return { ...comment, replies: repliesRes.data.replies || [] };
        })
      );
      setComments(updatedComments);
    } catch (error) {
      console.error("Error Fetching Comments:", error);
    }
  };
  useEffect(() => {
    fetchComments();
  }, [ticketId]);

  const handleSaveComment = async () => {
    try {
      if (!newComment.trim()) return;
      if (editingCommentId) {
        await api.put(`/editcomment/${editingCommentId}`, {
          comment_text: newComment,
        });
        setEditingCommentId(null);
      } else {
        await api.post("/addcomment", {
          ticket_id: ticketId,
          comment_text: newComment,
        });
      }
      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error("Error Saving Comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Delete This Comment?")) return;
    try {
      await api.delete(`/deletecomment/${commentId}`);
      fetchComments();
    } catch (error) {
      console.error("Error Deleting Comment:", error);
    }
  };

  const handleSaveReply = async (commentId) => {
    try {
      const replyText = replies[commentId]?.trim();
      if (!replyText) return;
      if (editingReply[commentId]) {
        await api.put(`/editreply/${editingReply[commentId]}`, {
          reply_text: replyText,
        });
        setEditingReply({ ...editingReply, [commentId]: null });
      } else {
        await api.post(`/replycomment/${commentId}`, { reply_text: replyText });
      }
      setReplies({ ...replies, [commentId]: "" });
      fetchComments();
    } catch (error) {
      console.error("Error Saving Reply:", error);
    }
  };
  const handleDeleteReply = async (replyId) => {
    if (!confirm("Delete this Reply?")) return;
    try {
      await api.delete(`/deletereply/${replyId}`);
      fetchComments();
    } catch (error) {
      console.error("Error deleting Reply:", error);
    }
  };

  const startEditingComment = (comment) => {
    setNewComment(comment.comment_text);
    setEditingCommentId(comment.id);
  };

  const startEditingReply = (commentId, reply) => {
    setReplies({ ...replies, [commentId]: reply.reply_text });
    setEditingReply({ ...editingReply, [commentId]: reply.id });
  };

  const cancelEditingComment = () => {
    setNewComment("");
    setEditingCommentId(null);
  };

  const cancelEditingReply = (commentId) => {
    setReplies({ ...replies, [commentId]: "" });
    setEditingReply({ ...editingReply, [commentId]: null });
  };

  return (
    <div className="p-4">
      <h3 className="text-3xl text-gray-500 font-bold mb-3">COMMENTS:</h3>

      {/* Comment input section*/}
      <div className="mb-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Add a comment..."
          rows="3"
        />
        <div className="mt-2 flex gap-2">
          <button
            onClick={handleSaveComment}
            className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {editingCommentId ? "Update Comment" : "Add Comment"}
          </button>
          {editingCommentId && (
            <button
              onClick={cancelEditingComment}
              className="bg-gray-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Comment list section*/}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-100 p-4 rounded">
            <p className="text-sm">{comment.comment_text}</p>
            <p className="text-xs text-gray-600">
              By {comment.user_name} ({comment.role}) at{" "}
              {new Date(comment.created_at).toLocaleString()}
            </p>
            <div className="mt-2">
              <button
                onClick={() => startEditingComment(comment)}
                className="text-blue-500 text-lg  cursor-pointer mr-3"
              >
                <FaRegEdit title="Edit Comment" />
              </button>
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="text-red-500 text-xl cursor-pointer"
              >
                <MdDelete title="Delete Comment" />
              </button>
            </div>

            {/* Replies section */}
            <div className="ml-4 mt-3 space-y-2">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="bg-white p-2 rounded">
                  <p className="text-sm">{reply.reply_text}</p>
                  <p className="text-xs text-gray-600">
                    By {reply.user_name} ({reply.role}) at{" "}
                    {new Date(reply.created_at).toLocaleString()}
                  </p>
                  <div className="mt-1">
                    <button
                      onClick={() => startEditingReply(comment.id, reply)}
                      className="text-blue-500 text-lg  cursor-pointer mr-3"
                    >
                      <FaRegEdit title="Edit Reply" />
                    </button>
                    <button
                      onClick={() => handleDeleteReply(reply.id)}
                      className="text-red-500 text-xl cursor-pointer"
                    >
                      <MdDelete title="Delete Reply" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Reply input section */}
              <textarea
                value={replies[comment.id] || ""}
                onChange={(e) =>
                  setReplies({ ...replies, [comment.id]: e.target.value })
                }
                className="w-full p-2 border rounded mt-2"
                placeholder="Add a reply..."
                rows="2"
              />
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleSaveReply(comment.id)}
                  className="bg-green-500 text-white px-4 py-1 rounded cursor-pointer hover:bg-green-600"
                >
                  {editingReply[comment.id] ? "Update Reply" : "Add Reply"}
                </button>
                {editingReply[comment.id] && (
                  <button
                    onClick={() => cancelEditingReply(comment.id)}
                    className="bg-gray-500 text-white px-4 py-1 rounded cursor-pointer hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
