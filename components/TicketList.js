import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoIosAddCircle } from "react-icons/io";
import { FaEye, FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import {
  deleteTicket,
  getAllTickets,
  addTicket,
  updateTicket,
} from "@/helper/Ticket";
import TicketModal from "./TicketModel";

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, mode: "", ticket: null });
  const router = useRouter();

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const res = await getAllTickets();
        setTickets(res.data.tickets || []);
      } catch (err) {
        console.error("Failed to load tickets");
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const openModal = (mode, ticket = null) =>
    setModal({ open: true, mode, ticket });
  const closeModal = () => setModal({ open: false, mode: "", ticket: null });

  const handleDelete = async (id) => {
    if (!confirm("Delete this ticket?")) return;
    try {
      await deleteTicket(id);
      setTickets((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert("Delete failed.");
    }
  };

  const handleSave = async (payload) => {
    try {
      if (modal.mode === "add") {
        await addTicket(payload);
      } else {
        await updateTicket(modal.ticket.id, payload);
      }
      const res = await getAllTickets();
      setTickets(res.data.tickets || []);
      closeModal();
    } catch (err) {
      alert("Save failed. Please try again.");
    }
  };

  if (loading) return <SkeletonLoader />;

  return (
    <div className="min-h-screen ml-64">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">TICKETS:</h1>
        <button
          onClick={() => openModal("add")}
          className="flex cursor-pointer items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
        >
          <IoIosAddCircle className="w-5 h-5" />
          New Ticket
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left p-6 font-semibold text-gray-700">
                  ID
                </th>
                <th className="text-left p-6 font-semibold text-gray-700">
                  Title
                </th>
                <th className="text-left p-6 font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left p-6 font-semibold text-gray-700">
                  Priority
                </th>
                <th className="text-left p-6 font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-500">
                    No tickets found. Create your first one!
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td
                      onClick={() => router.push(`/tickets/${ticket.id}`)}
                      className="p-4 cursor-pointer text-sm font-medium text-gray-600"
                    >
                      #{ticket.id}
                    </td>
                    <td
                      onClick={() => router.push(`/tickets/${ticket.id}`)}
                      className="p-4 cursor-pointer"
                    >
                      <div className="font-medium text-gray-900">
                        {ticket.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Created{" "}
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td
                      onClick={() => router.push(`/tickets/${ticket.id}`)}
                      className="p-4 cursor-pointer"
                    >
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td
                      onClick={() => router.push(`/tickets/${ticket.id}`)}
                      className="p-4 cursor-pointer"
                    >
                      <PriorityBadge priority={ticket.priority} />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {/* <ActionButton
                          icon={<FaEye />}
                          onClick={() => router.push(`/tickets/${ticket.id}`)}
                          color="indigo"
                          title="View"
                        /> */}
                        <ActionButton
                          icon={<FaRegEdit />}
                          onClick={() => openModal("edit", ticket)}
                          color="blue"
                          title="Edit"
                        />
                        <ActionButton
                          icon={<MdDelete />}
                          onClick={() => handleDelete(ticket.id)}
                          color="red"
                          title="Delete"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal.open && (
        <TicketModal
          mode={modal.mode}
          ticket={modal.ticket}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

const StatusBadge = ({ status }) => {
  const colors = {
    Open: "bg-green-100 text-green-800",
    "In Progress": "bg-yellow-100 text-yellow-800",
    Closed: "bg-gray-100 text-gray-800",
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
        colors[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  const colors = {
    High: "bg-red-100 text-red-800",
    Medium: "bg-orange-100 text-orange-800",
    Low: "bg-blue-100 text-blue-800",
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
        colors[priority] || "bg-gray-100 text-gray-800"
      }`}
    >
      {priority}
    </span>
  );
};

const ActionButton = ({ icon, onClick, color, title }) => {
  const colors = {
    indigo: "hover:bg-indigo-50 text-indigo-600",
    blue: "hover:bg-blue-50 text-blue-600",
    red: "hover:bg-red-50 text-red-600",
  };
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-2.5 rounded-lg transition-all ${colors[color]} cursor-pointer hover:scale-110`}
    >
      {icon}
    </button>
  );
};

const SkeletonLoader = () => (
  <div className="min-h-screen py-2 px-2 ml-64">
    <div className="animate-pulse">
      <div className="h-10 bg-gray-200 rounded w-48 mb-8"></div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex gap-6 py-6 border-b border-gray-100 last:border-0"
          >
            <div className="h-6 bg-gray-200 rounded w-12"></div>
            <div className="flex-1">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-100 rounded w-1/2 mt-2"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded-full w-20"></div>
            <div className="h-8 bg-gray-200 rounded-full w-20"></div>
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
