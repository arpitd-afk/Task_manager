import { useEffect, useState } from "react";
import { getAllTasks } from "@/helper/Tasks";
import TaskViewModal from "./TaskModel";

export default function TaskDash() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await getAllTasks();
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const getStatusBadge = (status) => {
    const styles = {
      Pending: "bg-yellow-100 text-yellow-700",
      "In Progress": "bg-blue-100 text-blue-700",
      Completed: "bg-green-100 text-green-700",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          styles[status] || "bg-gray-100 text-gray-700"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen py-4 px-6 ml-64">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">ALL TASKS LIST:</h1>
      </div>

      {loading ? (
        <SkeletonGrid />
      ) : tasks.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all group"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    #{task.id}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Ticket #{task.ticket_id}
                  </p>
                </div>
                {getStatusBadge(task.status)}
              </div>

              <h4 className="font-medium text-gray-800 mt-2">{task.title}</h4>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {task.description || "No description"}
              </p>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Assigned to</span>
                  <span className="font-medium text-gray-800">
                    User {task.assigned_to || "—"}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setViewModal(task)}
                className="mt-4 w-full cursor-pointer py-2 text-center text-indigo-600 font-medium text-sm border border-indigo-200 rounded-lg hover:bg-indigo-50 transition"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
      {viewModal && (
        <TaskViewModal task={viewModal} onClose={() => setViewModal(null)} />
      )}
    </div>
  );
}

const SkeletonGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-20 mb-2"></div>
        <div className="h-5 bg-gray-200 rounded w-32 mb-4"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-24 mt-4"></div>
      </div>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="text-center py-16">
    <p className="text-xl text-gray-600">No tasks found</p>
    <p className="text-gray-500 mt-2">Create a ticket to add tasks</p>
  </div>
);
