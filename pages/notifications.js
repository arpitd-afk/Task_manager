import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import {
  deleteNotifications,
  getNotifications,
  updateNotifications,
} from "@/helper/Notification";
import { MdDelete, MdOutlineMarkEmailRead } from "react-icons/md";
import { IoCheckmarkDoneSharp } from "react-icons/io5";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data.notifications || []);
    } catch (error) {
      console.error("Error fetching Notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await updateNotifications(id);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, is_read: true } : notif
        )
      );
    } catch (error) {
      console.error("Error marking Notification as read:", error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure to delete the Notification?")) {
      try {
        await deleteNotifications(id);
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
      } catch (error) {
        console.error("Error deleting Notification:", error);
      }
    }
  };

  if (!notifications)
    return (
      <div className="flex items-center p-4 ml-64 justify-center h-screen">
        Loading...
      </div>
    );

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-4">
          <div className="ml-66">
            <h2 className="text-3xl text-gray-500 font-bold mb-4">
              NOTIFICATIONS
            </h2>
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
                      <span className="text-green-600 text-lg">
                        <IoCheckmarkDoneSharp title="Read" />
                      </span>
                    ) : (
                      <span className="text-gray-400">
                        <IoCheckmarkDoneSharp title="Unread" />
                      </span>
                    )}
                  </div>
                  <div>
                    {!notif.is_read && (
                      <button
                        onClick={() => handleMarkRead(notif.id)}
                        className="bg-blue-500 hover:bg-blue-600 p-1.5 rounded text-white text-lg cursor-pointer mr-2"
                      >
                        <MdOutlineMarkEmailRead title="Make as Read" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notif.id)}
                      className="bg-red-500 hover:bg-red-600 p-1.5 rounded text-white text-lg cursor-pointer"
                    >
                      <MdDelete title="Delete" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
