import { useEffect, useState } from "react";
import TaskForm from "./TaskForm";
import Modal from "./Modal";
import { IoIosAddCircle } from "react-icons/io";
import { FaEye, FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useRouter } from "next/navigation";
import { deleteTask, getTasksByTicket } from "@/helper/Tasks";
import TaskViewModal from "./TaskModel";

export default function TaskList({ ticketId }) {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState(null);
  const router = useRouter();

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await getTasksByTicket(ticketId);
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticketId) fetchTasks();
  }, [ticketId]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this task?")) return;
    try {
      await deleteTask(id);
      fetchTasks();
    } catch (err) {
      alert("Delete failed.");
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    fetchTasks();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800">TASKS:</h3>
        <button
          onClick={() => {
            setEditingTask(null);
            setIsModalOpen(true);
          }}
          className="flex cursor-pointer items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-md hover:shadow-lg transition"
        >
          <IoIosAddCircle className="w-5 h-5" />
          Add Task
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <TaskForm
          ticketId={ticketId}
          task={editingTask}
          onSuccess={handleSuccess}
        />
      </Modal>

      <div className="p-6">
        {loading ? (
          <SkeletonTasks />
        ) : tasks.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="group bg-gray-50 hover:bg-gray-100 rounded-xl p-5 border border-gray-200 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div
                    onClick={() => setViewModal(task)}
                    className="flex-1 cursor-pointer"
                  >
                    <h4 className="font-semibold text-gray-900">
                      {task.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {task.description}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      <span>
                        Assigned to {task.assigned_to || "Unassigned"}
                      </span>
                      <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                        {task.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                    <ActionBtn
                      icon={<FaEye />}
                      onClick={() => setViewModal(task)}
                      color="indigo"
                      title="View"
                    />
                    <ActionBtn
                      icon={<FaRegEdit />}
                      onClick={() => handleEdit(task)}
                      color="blue"
                      title="Edit"
                    />
                    <ActionBtn
                      icon={<MdDelete />}
                      onClick={() => handleDelete(task.id)}
                      color="red"
                      title="Delete"
                    />
                  </div>
                </div>
              </div>
            ))}
            {viewModal && (
              <TaskViewModal
                task={viewModal}
                onClose={() => setViewModal(null)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Reusable components
const ActionBtn = ({ icon, onClick, color, title }) => {
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

// show when data is loading
const SkeletonTasks = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-gray-50 rounded-xl p-5 animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
        <div className="flex gap-4 mt-3">
          <div className="h-6 bg-gray-200 rounded-full w-24"></div>
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        </div>
      </div>
    ))}
  </div>
);

// show when no data is found
const EmptyState = () => (
  <div className="text-center py-12 text-gray-500">
    <p className="text-lg">No tasks yet.</p>
    <p className="text-sm mt-1">Click "Add Task" to get started!</p>
  </div>
);
