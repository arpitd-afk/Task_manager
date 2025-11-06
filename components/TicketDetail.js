import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import TaskList from "./TaskList";
import CommentSection from "./CommentSection";
import { getTicketByID } from "@/helper/Ticket";
import { ArrowLeft, Clock, AlertCircle, CheckCircle2 } from "lucide-react";

export default function TicketDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchTicket = async () => {
      setLoading(true);
      try {
        const res = await getTicketByID(id);
        setTicket(res.data);
      } catch (err) {
        console.error("Failed to load ticket");
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id]);

  if (loading) {
    return <SkeletonDetail />;
  }

  if (!ticket) {
    return <ErrorState />;
  }

  const priorityConfig = {
    High: { color: "text-red-600", bg: "bg-red-50", icon: AlertCircle },
    Medium: { color: "text-orange-600", bg: "bg-orange-50", icon: AlertCircle },
    Low: { color: "text-blue-600", bg: "bg-blue-50", icon: CheckCircle2 },
  };

  const statusConfig = {
    Open: { color: "text-green-600", bg: "bg-green-50", icon: CheckCircle2 },
    "In Progress": {
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      icon: Clock,
    },
    Closed: { color: "text-gray-600", bg: "bg-gray-50", icon: CheckCircle2 },
  };

  const priority = priorityConfig[ticket.priority] || priorityConfig.Medium;
  const status = statusConfig[ticket.status] || statusConfig.Open;
  const PriorityIcon = priority.icon;
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen  py-2 px-2 ml-64">
      <button
        onClick={() => router.push("/tickets")}
        className="flex items-center cursor-pointer gap-2 text-gray-600 hover:text-gray-900 mb-8 group transition"
      >
        <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition" />
        <span className="font-medium">Back to Tickets</span>
      </button>

      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              #{ticket.id} · {ticket.title}
            </h1>
            <p className="text-gray-500 mt-2">
              Created on {new Date(ticket.created_at).toLocaleDateString()} at{" "}
              {new Date(ticket.created_at).toLocaleTimeString()}
            </p>
          </div>
          <div className="flex gap-3">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl ${priority.bg}`}
            >
              <PriorityIcon className={`w-4 h-4 ${priority.color}`} />
              <span className={`text-sm font-semibold ${priority.color}`}>
                {ticket.priority}
              </span>
            </div>
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl ${status.bg}`}
            >
              <StatusIcon className={`w-4 h-4 ${status.color}`} />
              <span className={`text-sm font-semibold ${status.color}`}>
                {ticket.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          Description
        </h2>
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {ticket.description || "No description provided."}
          </p>
        </div>
      </div>

      {/* Tasks section*/}
      <div className="mb-8">
        <TaskList ticketId={id} />
      </div>

      {/* Comments section */}
      <div>
        <CommentSection ticketId={id} />
      </div>
    </div>
  );
}

// show Skeleton when data is loading
const SkeletonDetail = () => (
  <div className="min-h-screen py-2 px-2 ml-64">
    <div className="animate-pulse">
      <div className="h-10 bg-gray-200 rounded w-48 mb-8"></div>
      <div className="h-12 bg-gray-200 rounded mb-6"></div>
      <div className="bg-white rounded-2xl p-8 mb-8">
        <div className="h-6 bg-gray-200 rounded mb-4 w-32"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    </div>
  </div>
);

//show Error when no data is found
const ErrorState = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center ml-64">
    <div className="text-center">
      <p className="text-red-600 font-semibold text-lg">Ticket not found</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition"
      >
        Retry
      </button>
    </div>
  </div>
);
