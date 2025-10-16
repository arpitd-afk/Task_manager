import { useEffect, useState } from "react";
import api from "../lib/api";
import Pagination from "./Pagination";

export default function TaskList({ ticketId }) {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/getalltasks`);
      setTasks(res.data.tasks || []);
    } catch (error) {
      console.error("Error Fetching Tasks:", error);
    }
  };
  useEffect(() => {
    fetchTasks();
  }, [ticketId]);

  return (
    <div className="mb-8 ml-64">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-3xl text-gray-500 font-semibold mb-2">TASKS</h3>
      </div>
      <table className="w-full border-collapse bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">TICKET ID</th>
            <th className="p-2 text-left">TITLE</th>
            <th className="p-2 text-left">DESCRIPTION</th>
            <th className="p-2 text-left">ASSIGNED TO</th>
            <th className="p-2 text-left">STATUS</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr
              key={task.id}
              className="border-b border-gray-200 hover:bg-gray-50"
            >
              <td className="p-2">{task.id}</td>
              <td className="p-2">{task.ticket_id}</td>
              <td className="p-2">{task.title}</td>
              <td className="p-2">{task.description}</td>
              <td className="p-2">{task.assigned_to}</td>
              <td className="p-2">{task.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination />
    </div>
  );
}
