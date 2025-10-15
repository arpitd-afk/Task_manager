import { useEffect, useState } from "react";
import api from "../lib/api";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/getnotification");
      setNotifications(res.data.notifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await api.put(`/updatenotification/${id}`);
      fetchNotifications();
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure?")) {
      try {
        await api.delete(`/deletenotification/${id}`);
        fetchNotifications();
      } catch (error) {
        console.error("Error deleting notification:", error);
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="p-4 ml-64">
          <h2 className="text-2xl font-bold mb-4">Notifications</h2>
          <ul className="space-y-4">
            {notifications.map((notif) => (
              <li
                key={notif.id}
                className="bg-white p-4 rounded shadow flex justify-between items-center"
              >
                <div>
                  <p>{notif.message}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(notif.created_at).toLocaleString()}
                  </p>
                  {notif.is_read ? (
                    <span className="text-green-500">Read</span>
                  ) : (
                    <span className="text-red-500">Unread</span>
                  )}
                </div>
                <div>
                  {!notif.is_read && (
                    <button
                      onClick={() => handleMarkRead(notif.id)}
                      className="text-blue-600 hover:underline mr-2"
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notif.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
