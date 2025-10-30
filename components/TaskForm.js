import { useState, useEffect } from "react";
import api from "../lib/api";

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
        title: task.title,
        description: task.description,
        assigned_to: task.assigned_to,
        status: task.status,
      });
    }
  }, [task]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = { ...formData, ticket_id: ticketId };
      if (task) {
        await api.put(`/updatetask/${task.id}`, payload);
      } else {
        await api.post("/addtask", payload);
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded mb-4">
      <form onSubmit={handleSubmit} className="p-4">
        <div className="mb-4">
          <label className="block text-md font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full bg-white p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-md font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full bg-white p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-md font-medium">
            Assigned To (User ID)
          </label>
          <input
            type="number"
            name="assigned_to"
            value={formData.assigned_to}
            onChange={handleChange}
            className="w-full bg-white p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-md font-medium">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full bg-white p-2 border rounded"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-600 w-full text-white p-2 rounded cursor-pointer hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : task ? "Update Task" : "Save Task"}
        </button>
      </form>
    </div>
  );
}
