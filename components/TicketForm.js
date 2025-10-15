import { useState, useEffect } from "react";
import api from "../lib/api";
import { useRouter } from "next/router";

export default function TicketForm({ ticketId }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Low",
    status: "Open",
  });
  const router = useRouter();

  useEffect(() => {
    if (ticketId) {
      const fetchTicket = async () => {
        try {
          const res = await api.get(`/getticket/${ticketId}`);
          setFormData({
            title: res.data.title,
            description: res.data.description,
            priority: res.data.priority,
            status: res.data.status,
          });
        } catch (error) {
          console.error("Error fetching ticket:", error);
        }
      };
      fetchTicket();
    }
  }, [ticketId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (ticketId) {
        await api.put(`/updateticket/${ticketId}`, formData);
      } else {
        await api.post("/addticket", formData);
      }
      router.push("/tickets");
    } catch (error) {
      console.error("Error saving ticket:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 max-w-md mx-auto bg-white rounded shadow ml-64"
    >
      <h2 className="text-2xl font-bold mb-4">
        {ticketId ? "Edit" : "Create"} Ticket
      </h2>
      <div className="mb-4">
        <label className="block text-sm font-medium">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Priority</label>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Closed">Closed</option>
        </select>
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Save
      </button>
    </form>
  );
}
