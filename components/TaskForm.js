import { useState, useEffect } from "react";
import { addTask, updateTask } from "@/helper/Tasks";

export default function TaskForm({ ticketId, task, onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assigned_to: "",
    status: "Pending",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        assigned_to: task.assigned_to || "",
        status: task.status || "Pending",
      });
    }
  }, [task]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Title and description are required.");
      return;
    }

    setIsLoading(true);
    try {
      const payload = { ...formData, ticket_id: ticketId };
      if (task) {
        await updateTask(task.id, payload);
      } else {
        await addTask(payload);
      }
      onSuccess();
    } catch (error) {
      alert("Save failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-5">
          {task ? "Edit Task" : "Create New Task"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Fix dashboard bug"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Steps to resolve the conflict..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Assigned To (ID) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="assigned_to"
              value={formData.assigned_to}
              onChange={handleChange}
              required
              placeholder="7"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 cursor-pointer text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm disabled:opacity-60 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>{task ? "Update" : "Create"} Task</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
