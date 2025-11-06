import { useEffect, useState, useCallback } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete, MdReply } from "react-icons/md";
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

const CommentInput = ({
  value,
  onChange,
  onSave,
  onCancel,
  isEditing,
  placeholder,
  buttonText = "Post",
}) => (
  <div className="flex gap-2 mt-1">
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-11 p-2 bg-white border border-gray-300 rounded-lg"
      placeholder={placeholder}
      rows={1}
    />
    <div className="flex gap-2">
      <button
        onClick={onSave}
        disabled={!value.trim()}
        className="px-3 py-1 cursor-pointer bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
      >
        {isEditing ? "Update" : buttonText}
      </button>
      {isEditing && (
        <button
          onClick={onCancel}
          className="px-3 py-1 cursor-pointer bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
        >
          Cancel
        </button>
      )}
    </div>
  </div>
);

const ActionBtn = ({ icon, onClick, color }) => {
  const colors = {
    blue: "hover:bg-blue-50 text-blue-600",
    red: "hover:bg-red-50 text-red-600",
  };
  return (
    <button
      onClick={onClick}
      className={`p-2.5 rounded-lg cursor-pointer transition ${colors[color]} hover:scale-110`}
    >
      {icon}
    </button>
  );
};

// Reply Component
const Reply = ({ reply, onEdit, onDelete }) => {
  return (
    <div className="bg-white border border-gray-200 p-1.5 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-800">{reply.reply_text}</p>
          <p className="text-xs text-gray-500">
            {reply.user_name} ({reply.role}) •{" "}
            {new Date(reply.created_at).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-1 opacity-30 hover:opacity-100 transition">
          <ActionBtn
            icon={<FaRegEdit />}
            onClick={() => onEdit(reply)}
            color="blue"
          />
          <ActionBtn
            icon={<MdDelete />}
            onClick={() => onDelete(reply.id)}
            color="red"
          />
        </div>
      </div>
    </div>
  );
};

const Comment = ({
  comment,
  onEdit,
  onDelete,
  onReplySave,
  onReplyEdit,
  onReplyDelete,
  replyDraft,
  setReplyDraft,
  editingReplyId,
}) => {
  const [showReply, setShowReply] = useState(false);

  return (
    <div className="bg-gray-50 border border-gray-200 p-5 rounded-xl shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-gray-800 font-medium">{comment.comment_text}</p>
          <p className="text-xs text-gray-500">
            {comment.user_name} ({comment.role}) •{" "}
            {new Date(comment.created_at).toLocaleString()}
          </p>
        </div>

        <div className="flex gap-2 opacity-30 hover:opacity-100 transition">
          <ActionBtn
            icon={<FaRegEdit />}
            onClick={() => onEdit(comment)}
            color="blue"
          />
          <ActionBtn
            icon={<MdDelete />}
            onClick={() => onDelete(comment.id)}
            color="red"
          />
        </div>
      </div>

      {/* Replies */}
      <div className="mt-4 space-y-3 pl-6 border-l-2 border-gray-300">
        <h2 className="text-sm font-semibold mb-1">Replies:</h2>
        {comment.replies?.map((reply) => (
          <Reply
            key={reply.id}
            reply={reply}
            commentId={comment.id}
            onEdit={(r) => onReplyEdit(comment.id, r)}
            onDelete={onReplyDelete}
          />
        ))}

        {/* Reply Input */}
        {showReply && (
          <CommentInput
            value={replyDraft}
            onChange={setReplyDraft}
            onSave={() => onReplySave(comment.id)}
            onCancel={() => {
              setShowReply(false);
              setReplyDraft("");
            }}
            isEditing={editingReplyId === comment.id}
            placeholder="Write a reply..."
            buttonText="Reply"
          />
        )}

        {/* Show Reply */}
        <button
          onClick={() => setShowReply(!showReply)}
          className="text-sm cursor-pointer text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-2"
        >
          <MdReply className="text-lg" />
          {showReply ? "Hide" : "Reply"}
        </button>
      </div>
    </div>
  );
};

export default function CommentSection({ ticketId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingComment, setEditingComment] = useState(null);
  const [newCommentText, setNewCommentText] = useState("");

  const [replyDrafts, setReplyDrafts] = useState({});
  const [editingReply, setEditingReply] = useState({});

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getCommentByTicket(ticketId);
      const commentsData = res.data.comments || [];

      const commentsWithReplies = await Promise.all(
        commentsData.map(async (comment) => {
          const replyRes = await getCommentReply(comment.id);
          return { ...comment, replies: replyRes.data.replies || [] };
        })
      );

      setComments(commentsWithReplies);
    } catch (err) {
      setError("Failed to load comments.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    if (ticketId) fetchComments();
  }, [ticketId, fetchComments]);

  const saveComment = async () => {
    if (!newCommentText.trim()) return;

    try {
      if (editingComment) {
        await updateComment(editingComment.id, {
          comment_text: newCommentText,
        });
        setEditingComment(null);
      } else {
        await addcomment({ ticket_id: ticketId, comment_text: newCommentText });
      }
      setNewCommentText("");
      fetchComments();
    } catch (err) {
      alert("Failed to save comment.");
    }
  };

  const deleteCommentHandler = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await deleteComment(commentId);
      fetchComments();
    } catch (err) {
      alert("Failed to delete comment.");
    }
  };

  const saveReply = async (commentId) => {
    const text = replyDrafts[commentId];
    if (!text) return;

    try {
      if (editingReply[commentId]) {
        await updateCommentReply(editingReply[commentId], { reply_text: text });
        setEditingReply((prev) => ({ ...prev, [commentId]: null }));
      } else {
        await addcommentReply(commentId, { reply_text: text });
      }
      setReplyDrafts((prev) => ({ ...prev, [commentId]: "" }));
      fetchComments();
    } catch (err) {
      alert("Failed to save reply.");
    }
  };

  const startReplyEdit = (commentId, reply) => {
    setReplyDrafts((prev) => ({ ...prev, [commentId]: reply.reply_text }));
    setEditingReply((prev) => ({ ...prev, [commentId]: reply.id }));
  };

  const deleteReplyHandler = async (replyId) => {
    if (!window.confirm("Delete this reply?")) return;
    try {
      await deleteCommentReply(replyId);
      fetchComments();
    } catch (err) {
      alert("Failed to delete reply.");
    }
  };

  const startEditComment = (comment) => {
    setEditingComment({ id: comment.id });
    setNewCommentText(comment.comment_text);
  };

  const cancelEditComment = () => {
    setEditingComment(null);
    setNewCommentText("");
  };

  const handleReplyChange = useCallback((commentId, value) => {
    setReplyDrafts((prev) => ({ ...prev, [commentId]: value }));
  }, []);

  // show when data is loading
  const SkeletonTasks = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-gray-50 rounded-xl p-5 animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mt-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mt-2 ml-8"></div>
          <div className="justify-end flex gap-4 mt-3">
            <div className="h-6 bg-gray-200 rounded-full w-18"></div>
            <div className="h-6 bg-gray-200 rounded-full w-18"></div>
          </div>
          <div className="h-6 ml-8 bg-gray-200 rounded-full w-18"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-3 max-w-2xl rounded-xl shadow-md border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-2">COMMENTS:</h3>

      {/* Comment Input */}
      <div className="bg-white mb-4">
        <CommentInput
          value={newCommentText}
          onChange={setNewCommentText}
          onSave={saveComment}
          onCancel={cancelEditComment}
          isEditing={!!editingComment}
          placeholder="Share your thoughts..."
          buttonText={editingComment ? "Update Comment" : "Post"}
        />
      </div>

      {loading && <SkeletonTasks />}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 && !loading && (
          <p className="text-center text-gray-500">
            No comments yet. Be the first!
          </p>
        )}

        {comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            onEdit={startEditComment}
            onDelete={deleteCommentHandler}
            onReplySave={saveReply}
            onReplyEdit={startReplyEdit}
            onReplyDelete={deleteReplyHandler}
            replyDraft={replyDrafts[comment.id] || ""}
            setReplyDraft={(value) => handleReplyChange(comment.id, value)}
            isReplying={!!replyDrafts[comment.id]}
            editingReplyId={editingReply[comment.id]}
          />
        ))}
      </div>
    </div>
  );
}
