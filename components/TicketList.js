import { useEffect, useState } from "react";
import Link from "next/link";
import Pagination from "./Pagination";
import { useRouter } from "next/router";
import { IoIosAddCircle } from "react-icons/io";
import { FaEye, FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { deleteTicket, getAllTickets } from "@/helper/Ticket";

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const router = useRouter();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await getAllTickets();
        setTickets(response.data.tickets || []);
        setTotalPages(response.data.totalPages || 1);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };
    fetchTickets(currentPage);
  }, [currentPage]);

  const handleDelete = async (id) => {
    if (confirm("Are you sure?")) {
      try {
        await deleteTicket(id);
        setTickets(tickets.filter((ticket) => ticket.id !== id));
      } catch (error) {
        console.log("Error deleting ticket:", error);
      }
    }
  };

  if (!tickets)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );

  return (
    <div className="ml-64">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold mb-4 text-gray-500">TICKETS</h2>
        <Link
          href="/tickets/create"
          className="bg-green-600 hover:bg-green-700 text-white p-2 rounded mb-4 inline-block"
        >
          <IoIosAddCircle title="Create Ticket" />
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
                <button
                  onClick={() => router.push(`/tickets/${ticket.id}`)}
                  className="text-white bg-purple-600 hover:bg-purple-700 p-1.5 cursor-pointer rounded mr-2"
                >
                  <FaEye title="View Ticket" />
                </button>
                <button
                  onClick={() => router.push(`/tickets/edit/${ticket.id}`)}
                  className="text-white text-md bg-blue-500 cursor-pointer p-1.5 rounded hover:bg-blue-600 mr-2"
                >
                  <FaRegEdit title="Edit Ticket" />
                </button>
                <button
                  onClick={() => handleDelete(ticket.id)}
                  className="bg-red-600 hover:bg-red-700 p-1.5 text-white cursor-pointer rounded"
                >
                  <MdDelete title="Delete Ticket" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        totalItems={totalPages * ITEMS_PER_PAGE}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
