import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import TaskList from "./TaskList";
import CommentSection from "./CommentSection";
import { getTicketByID } from "@/helper/Ticket";
import { IoIosArrowRoundBack } from "react-icons/io";

export default function TicketDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchTicket = async () => {
        try {
          const res = await getTicketByID(id);
          setTicket(res.data);
        } catch (error) {
          console.error("Error fetching ticket:", error);
        }
      };
      fetchTicket();
    }
  }, [id]);

  if (!ticket)
    return (
      <div className="flex items-center p-4 ml-64 justify-center h-screen">
        Loading...
      </div>
    );

  return (
    <div className="md:ml-66">
      <button
        onClick={() => router.push("/tickets")}
        className="justify-start text-gray-700 text-3xl cursor-pointer rounded"
      >
        <IoIosArrowRoundBack />
      </button>
      <h2 className="text-3xl font-bold text-gray-500 mb-4">TICKET DETAILS</h2>
      <div className="bg-white w-full text-gray-800 text-sm p-6 rounded-lg shadow-md border border-gray-100 mb-6 hover:shadow-lg transition-shadow duration-300">
        <div className="mb-4 border-b border-gray-200 pb-3">
          <h2 className="text-lg font-semibold text-gray-900">
            {ticket.title}
          </h2>
        </div>
        <div className="space-y-3">
          <p className="flex items-start">
            <span className="font-medium text-gray-600 w-28">Description:</span>
            <span className="text-gray-800 flex-1">{ticket.description}</span>
          </p>
          <p className="flex items-center">
            <span className="font-medium text-gray-600 w-28">Priority:</span>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded ${
                ticket.priority === "High"
                  ? "bg-red-100 text-red-700"
                  : ticket.priority === "Medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {ticket.priority}
            </span>
          </p>
          <p className="flex items-center">
            <span className="font-medium text-gray-600 w-28">Status:</span>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded ${
                ticket.status === "Open"
                  ? "bg-green-100 text-green-700"
                  : ticket.status === "In Progress"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {ticket.status}
            </span>
          </p>
        </div>
      </div>
      <TaskList ticketId={id} />
      <CommentSection ticketId={id} />
    </div>
  );
}
