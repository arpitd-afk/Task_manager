import { X, Clock, User, CheckCircle2 } from "lucide-react";

export default function TaskViewModal({ task, onClose }) {
  const statusColor =
    {
      Pending: "bg-yellow-100 text-yellow-700",
      "In Progress": "bg-blue-100 text-blue-700",
      Completed: "bg-green-100 text-green-700",
    }[task.status] || "bg-gray-100 text-gray-700";

  const InfoRow = ({ label, value, icon }) => (
    <div>
      <p className="text-sm font-medium text-gray-600 mb-1.5 flex items-center gap-2">
        {icon}
        {label}
      </p>
      <p className="text-gray-800">{value || "—"}</p>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-indigo-600" />
            Task #{task.id}
          </h2>
          <button
            onClick={onClose}
            className="p-1 cursor-pointer hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-500 mb-6">
            Created on {new Date(task.created_at).toLocaleDateString()} at{" "}
            {new Date(task.created_at).toLocaleTimeString()}
          </p>

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
