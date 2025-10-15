import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../lib/api";
import Link from "next/link";
import TaskList from "./TaskList";

export default function TicketDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchTicket = async () => {
        try {
          const res = await api.get(`/getticket/${id}`);
          setTicket(res.data);
        } catch (error) {
          console.error("Error fetching ticket:", error);
        }
      };
      fetchTicket();
    }
  }, [id]);

  if (!ticket) return <div className="p-4 ml-64">Loading...</div>;

  return (
    <div className="p-4 ml-64">
      <h2 className="text-3xl font-bold text-gray-500 mb-4">TICKET DETAILS</h2>
      <div className="bg-white text-gray-800 p-4 rounded shadow mb-4">
        <p className="mb-2">
          <strong>Title:</strong> {ticket.title}
        </p>
        <p className="mb-2">
          <strong>Description:</strong> {ticket.description}
        </p>
        <p className="mb-2">
          <strong>Priority:</strong> {ticket.priority}
        </p>
        <p className="mb-2">
          <strong>Status:</strong> {ticket.status}
        </p>
        <Link
          href={`/tickets/edit/${id}`}
          className="text-white bg-blue-500 p-2 rounded-sm hover:bg-blue-600 mr-2"
        >
          Edit
        </Link>
      </div>
      <TaskList ticketId={id} />
    </div>
  );
}
