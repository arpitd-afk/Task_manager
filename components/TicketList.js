import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../lib/api";
import Pagination from "./Pagination";

export default function TicketList() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get("/getalltickets");
        setTickets(response.data.tickets || []);
      } catch (error) {
        console.error("Error Fetching Tickets:", error);
      }
    };
    fetchTickets();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Are you Sure?")) {
      try {
        await api.delete(`/deleteticket/${id}`);
        setTickets(tickets.filter((ticket) => ticket.id !== id));
      } catch (error) {
        console.error("Error deleting ticket:", error);
      }
    }
  };

  return (
    <div className="p-2 ml-64">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold mb-4 text-gray-500">TICKETS</h2>
        <Link
          href="/tickets/create"
          className="bg-green-600 text-white p-2 rounded mb-4 inline-block"
        >
          Create Ticket
        </Link>
      </div>
      <table className="w-full border-collapse bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Title</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Priority</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr
              key={ticket.id}
              className="border-b border-gray-200 hover:bg-gray-50"
            >
              <td className="p-2">{ticket.id}</td>
              <td className="p-2">{ticket.title}</td>
              <td className="p-2">{ticket.status}</td>
              <td className="p-2">{ticket.priority}</td>
              <td className="p-2">
                <Link
                  href={`/tickets/${ticket.id}`}
                  className="text-blue-600 hover:text-blue-700 hover:underline mr-4"
                >
                  View
                </Link>
                <button
                  onClick={() => handleDelete(ticket.id)}
                  className="text-red-600 hover:text-red-700 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination />
    </div>
  );
}
