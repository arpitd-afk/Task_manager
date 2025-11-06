import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getTaskById } from "@/helper/Tasks";
import { ArrowLeft, Clock, User, CheckCircle2 } from "lucide-react";

export default function TaskDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchTask = async () => {
      setLoading(true);
      try {
        const res = await getTaskById(id);
        setTask(res.data);
      } catch (err) {
        console.error("Failed to load Task");
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  if (loading) return <Skeleton />;
  if (!task) return <NotFound />;

  const statusColor =
    {
      Pending: "bg-yellow-100 text-yellow-700",
      "In Progress": "bg-blue-100 text-blue-700",
      Completed: "bg-green-100 text-green-700",
    }[task.status] || "bg-gray-100 text-gray-700";

  return (
    <div className="min-h-screen py-2 px-2 ml-64">
      <button
        onClick={() => router.push("/tasks")}
        className="flex cursor-pointer items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 group transition"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition" />
        <span className="font-medium text-sm">Back to Tasks</span>
      </button>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <CheckCircle2 className="w-7 h-7 text-indigo-600" />
              Task #{task.id}
            </h1>
            <p className="text-gray-500 mt-2">
              Created on {new Date(task.created_at).toLocaleDateString()} at{" "}
              {new Date(task.created_at).toLocaleTimeString()}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-5">
              <InfoRow label="Title" value={task.title} />
              <InfoRow label="Description" value={task.description} multiline />
              <InfoRow label="Ticket ID" value={`#${task.ticket_id}`} />
            </div>

            <div className="space-y-5">
              <InfoRow
                label="Assigned To"
                value={task.assigned_to || "Unassigned"}
                icon={<User className="w-4 h-4" />}
              />
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1.5">
                  Status
                </p>
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${statusColor}`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  {task.status}
                </span>
              </div>
              <InfoRow
                label="Created"
                value={new Date(task.created_at).toLocaleString()}
                icon={<Clock className="w-4 h-4" />}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const InfoRow = ({ label, value, icon, multiline }) => (
  <div>
    <p className="text-sm font-medium text-gray-600 mb-1.5 flex items-center gap-2">
      {icon}
      {label}
    </p>
    <p className={`text-gray-800 ${multiline ? "whitespace-pre-wrap" : ""}`}>
      {value || "—"}
    </p>
  </div>
);

// show this when page data is loading
const Skeleton = () => (
  <div className="min-h-screen py-2 px-2 ml-64">
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl p-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="h-5 bg-gray-200 rounded w-24"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-4">
            <div className="h-5 bg-gray-200 rounded w-20"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Not Found
const NotFound = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center ml-64">
    <div className="text-center">
      <p className="text-xl font-semibold text-gray-700">Task not found</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Retry
      </button>
    </div>
  </div>
);
