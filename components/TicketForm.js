import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addTicket, getTicketByID, updateTicket } from "@/helper/Ticket";
import { ArrowLeft } from "lucide-react";

export default function TicketForm({ ticketId }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "Open",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (ticketId) {
      const fetchTicket = async () => {
        setLoading(true);
        try {
          const res = await getTicketByID(ticketId);
          setFormData({
            title: res.data.title || "",
            description: res.data.description || "",
            priority: res.data.priority || "Medium",
            status: res.data.status || "Open",
          });
        } catch (err) {
          alert("Failed to load Ticket.");
        } finally {
          setLoading(false);
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
    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Title and description are required.");
      return;
    }

    setSaving(true);
    try {
      if (ticketId) {
        await updateTicket(ticketId, formData);
      } else {
        await addTicket(formData);
      }
      router.push("/tickets");
    } catch (err) {
      alert("Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="py-2 px-2 ml-64">
      <button
        onClick={() => router.push("/tickets")}
        className="flex items-center cursor-pointer gap-2 text-gray-600 hover:text-gray-900 mb-8 group transition"
      >
        <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition" />
        <span className="font-medium">Back to Tickets</span>
      </button>

      {/* Ticket Form */}
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {ticketId ? "Edit Ticket" : "Create New Ticket"}
            </h1>
          </div>

          {loading ? (
            <FormSkeleton />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Login page not loading"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Provide detailed steps to reproduce the issue..."
                  className="w-full h-30 px-4 py-3 border border-gray-300 rounded-xl resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => router.push("/tickets")}
                  className="px-4 py-2.5 cursor-pointer border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2.5 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>{ticketId ? "Update" : "Create"}</>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// Skeleton show when data is loading
const FormSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-10 bg-gray-200 rounded-xl"></div>
    <div className="h-32 bg-gray-200 rounded-xl"></div>
    <div className="grid grid-cols-2 gap-6">
      <div className="h-12 bg-gray-200 rounded-xl"></div>
      <div className="h-12 bg-gray-200 rounded-xl"></div>
    </div>
    <div className="flex justify-end gap-3">
      <div className="h-12 w-28 bg-gray-200 rounded-xl"></div>
      <div className="h-12 w-36 bg-gray-200 rounded-xl"></div>
    </div>
  </div>
);
