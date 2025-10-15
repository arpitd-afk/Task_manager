import { useEffect, useState } from "react";
import api from "../lib/api";
import TaskForm from "./TaskForm";
import Pagination from "./Pagination";

export default function TaskList({ ticketId }) {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/getalltasks`);
      setTasks(res.data.tasks || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [ticketId]);

  const handleDelete = async (taskId) => {
    if (confirm("Are you sure?")) {
      try {
        await api.delete(`/deletetask/${taskId}`);
        fetchTasks();
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingTask(null);
    fetchTasks();
  };

  return (
    <div className="mb-8 ml-64">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-3xl text-gray-500 font-semibold mb-2">Tasks</h3>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingTask(null);
          }}
          className="bg-green-600 hover:bg-green-500 text-white p-2 rounded mb-4"
        >
          {showForm ? "Cancel" : "Add Task"}
        </button>
      </div>
      {showForm && (
        <TaskForm
          ticketId={ticketId}
          task={editingTask}
          onSuccess={handleSuccess}
        />
      )}
      <table className="w-full border-collapse bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">Title</th>
            <th className="p-2 text-left">Description</th>
            <th className="p-2 text-left">Assigned To</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr
              key={task.id}
              className="border-b border-gray-200 hover:bg-gray-50"
            >
              <td className="p-2">{task.title}</td>
              <td className="p-2">{task.description}</td>
              <td className="p-2">{task.assigned_to}</td>
              <td className="p-2">{task.status}</td>
              <td className="p-2">
                <button
                  onClick={() => handleEdit(task)}
                  className="text-blue-600 hover:underline mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="text-red-600 hover:underline"
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
