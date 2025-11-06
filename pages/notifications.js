import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import {
  deleteNotifications,
  getNotifications,
  updateNotifications,
} from "@/helper/Notification";
import { Bell, Check, Mail, Trash2, Clock } from "lucide-react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await getNotifications();
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error("Failed to load Notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await updateNotifications(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      alert("Failed to mark as read.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this Notification?")) return;
    try {
      await deleteNotifications(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      alert("Delete failed.");
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 py-15 ml-64">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    NOTIFICATIONS:
                  </h1>
                  <p className="text-gray-500 mt-2">
                    {unreadCount > 0
                      ? `${unreadCount} unread`
                      : "All caught up!"}
                  </p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={() =>
                      notifications
                        .filter((n) => !n.is_read)
                        .forEach((n) => handleMarkRead(n.id))
                    }
                    className="px-4 py-2.5 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm shadow-md hover:shadow-lg transition flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Mark all as read
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <SkeletonList />
            ) : notifications.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-4">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`bg-white rounded-xl border p-3 shadow-sm transition-all hover:shadow-md ${
                      !notif.is_read
                        ? "border-indigo-200 bg-indigo-50/30"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-2.5 h-2.5 rounded-full ${
                              !notif.is_read ? "bg-indigo-600" : "bg-gray-400"
                            }`}
                          />
                          <p className="font-medium text-gray-900">
                            {notif.message}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(notif.created_at).toLocaleString()}
                          </span>
                          {!notif.is_read && (
                            <span className="flex items-center gap-1 text-indigo-600">
                              <Mail className="w-3.5 h-3.5" />
                              Unread
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        {!notif.is_read && (
                          <button
                            onClick={() => handleMarkRead(notif.id)}
                            className="p-2.5 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-700 transition"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4 cursor-pointer" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notif.id)}
                          className="p-2.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 cursor-pointer" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// Skeleton show when page data is loading
const SkeletonList = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mt-3"></div>
          </div>
          <div className="flex gap-2">
            <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
            <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Empty state when no data found
const EmptyState = () => (
  <div className="text-center py-16">
    <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
    <p className="text-xl text-gray-600">No notifications</p>
    <p className="text-gray-500 mt-2">You're all caught up!</p>
  </div>
);
