import { useEffect, useState } from "react";
import api from "../lib/api";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Pagination from "../components/Pagination";
import { getNotifications } from "@/helper/Notification";
import { MdDelete, MdOutlineMarkEmailRead } from "react-icons/md";
import { AiOutlineCheck } from "react-icons/ai";
import { IoCheckmarkDoneSharp } from "react-icons/io5";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const ITEMS_PER_PAGE = 10;

  const fetchNotifications = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getNotifications();
      setNotifications(res.data.notifications || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error("Error Fetching Notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(currentPage);
  }, [currentPage]);

  const handleMarkRead = async (id) => {
    try {
      await api.put(`/updatenotification/${id}`);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, is_read: true } : notif
        )
      );
    } catch (error) {
      console.error("Error Marking As Read:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/deletenotification/${id}`);
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    } catch (error) {
      console.error("Error Deleting Notification:", error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="p-4 ml-64">
          <h2 className="text-3xl text-gray-500 font-bold mb-4">
            NOTIFICATIONS
          </h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
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
          )}
          <Pagination
            totalItems={totalPages * ITEMS_PER_PAGE}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
