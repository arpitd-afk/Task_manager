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
    if (confirm("Are You Sure?")) {
      try {
        await api.delete(`/deleteticket/${id}`);
        setTickets(tickets.filter((ticket) => ticket.id !== id));
      } catch (error) {
        console.error("Error Deleting Ticket:", error);
      }
    }
  };

  return (
    <div className="p-2 ml-64">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold mb-4 text-gray-500">TICKETS</h2>
        <Link
          href="/tickets/create"
          className="bg-green-600 hover:bg-green-700 text-white p-2 rounded mb-4 inline-block"
        >
          Create Ticket
        </Link>
      </div>
      <table className="w-full border-collapse bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">TITLE</th>
            <th className="p-2 text-left">STATUS</th>
            <th className="p-2 text-left">PRIORITY</th>
            <th className="p-2 text-left">ACTIONS</th>
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
                  className="text-white bg-blue-600 hover:bg-blue-700 p-2 cursor-pointer rounded mr-4"
                >
                  View
                </Link>
                <button
                  onClick={() => handleDelete(ticket.id)}
                  className="bg-red-600 hover:bg-red-700 p-1.5 text-white cursor-pointer rounded"
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
