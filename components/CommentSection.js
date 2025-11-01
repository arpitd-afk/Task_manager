import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import {
  addcomment,
  addcommentReply,
  deleteComment,
  deleteCommentReply,
  getCommentByTicket,
  getCommentReply,
  updateComment,
  updateCommentReply,
} from "@/helper/Comment";

export default function CommentSection({ ticketId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replies, setReplies] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingReply, setEditingReply] = useState({});
  const fetchComments = async () => {
    try {
      const res = await getCommentByTicket(ticketId);
      const commentsData = res.data.comments || [];
      const updatedComments = await Promise.all(
        commentsData.map(async (comment) => {
          const repliesRes = await getCommentReply(comment.id);
          return { ...comment, replies: repliesRes.data.replies || [] };
        })
      );
      setComments(updatedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };
  useEffect(() => {
    fetchComments();
  }, [ticketId]);

  const handleSaveComment = async () => {
    try {
      if (!newComment.trim()) return;
      if (editingCommentId) {
        await updateComment(editingCommentId, { comment_text: newComment });
        setEditingCommentId(null);
      } else {
        await addcomment({
          ticket_id: ticketId,
          comment_text: newComment,
        });
      }
      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error("Error saving comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Delete this comment?")) return;
    try {
      await deleteComment(commentId);
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleSaveReply = async (commentId) => {
    try {
      const replyText = replies[commentId]?.trim();
      if (!replyText) return;
      if (editingReply[commentId]) {
        await updateCommentReply(editingReply[commentId], {
          reply_text: replyText,
        });
        setEditingReply({ ...editingReply, [commentId]: null });
      } else {
        await addcommentReply(commentId, { reply_text: replyText });
      }
      setReplies({ ...replies, [commentId]: "" });
      fetchComments();
    } catch (error) {
      console.error("Error saving reply:", error);
    }
  };
  const handleDeleteReply = async (replyId) => {
    if (!confirm("Delete this reply?")) return;
    try {
      await deleteCommentReply(replyId);
      fetchComments();
    } catch (error) {
      console.error("Error deleting reply:", error);
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
        <div className="flex gap-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="h-10 w-98 p-1.5 pl-3 border border-gray-300 rounded"
            placeholder="Add a comment..."
            rows="3"
          />
          <button
            onClick={handleSaveComment}
            className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {editingCommentId ? "Edit" : "Add"}
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
          <div key={comment.id} className="bg-gray-100 w-138 p-4 rounded">
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
            <div className="ml-4 mt-3 space-y-2 w-120">
              {comment.replies.map((reply) => (
                <div
                  key={reply.id}
                  className="bg-white border border-gray-300 p-2 rounded"
                >
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
                className="w-full p-1.5 h-10 border bg-white border-gray-300 rounded mt-2"
                placeholder="Add a reply..."
                rows="2"
              />
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleSaveReply(comment.id)}
                  className="bg-green-500 text-white px-4 py-1 rounded cursor-pointer hover:bg-green-600"
                >
                  {editingReply[comment.id] ? "Edit Reply" : "Reply"}
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
