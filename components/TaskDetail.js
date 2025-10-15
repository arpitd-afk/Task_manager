import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../lib/api";

export default function TaskDetail() {
  const API_BASE = process.env.API_BASE_URL || "http://localhost:5000/api";
  const router = useRouter();
  const { id } = router.query;
  const [task, setTask] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchTask = async () => {
        try {
          const res = await api.get(`${API_BASE}/gettask/${id}`);
          setTask(res.data);
        } catch (error) {
          console.error("Error fetching task:", error);
        }
      };
      fetchTask();
    }
  }, [id]);

  if (!task)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Task Details
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between">
            <p className="font-semibold text-gray-600">Task ID:</p>
            <p className="text-gray-800">{task.id}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-semibold text-gray-600">Ticket ID:</p>
            <p className="text-gray-800">{task.ticket_id}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-semibold text-gray-600">Assigned To:</p>
            <p className="text-gray-800">{task.assigned_to}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-semibold text-gray-600">Title:</p>
            <p className="text-gray-800">{task.title}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-semibold text-gray-600">Description:</p>
            <p className="text-gray-800">{task.description}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-semibold text-gray-600">Status:</p>
            <p className="text-gray-800">{task.status}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
