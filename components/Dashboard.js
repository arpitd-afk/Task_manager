import { useEffect, useState } from "react";
import api from "../lib/api";
import { getUserRole } from "@/lib/auth";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Legend } from "recharts";

export default function Dashboard() {
  const role = getUserRole();
  const [summary, setSummary] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [taskStatuses, setTaskStatuses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sumRes = await api.get("/tickets/summary");
        setSummary(sumRes.data.summary || []);

        const priRes = await api.get("/tickets/priority");
        setPriorities(priRes.data.ticketsByPriority || []);

        const taskRes = await api.get("/tasks/status");
        setTaskStatuses(taskRes.data.tasksByStatus || []);
      } catch (error) {
        console.error("Error Fetching Dashboard Data:", error);
      }
    };
    fetchData();
  }, []);

  const lineChartData = summary.map((item) => ({
    name: item.status,
    count: item.count,
  }));

  const pieChartData = priorities.map((item) => ({
    name: item.priority,
    value: item.count,
  }));

  return (
    <div className="p-6 md:ml-64  min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-500 mb-8">
        {role} - Dashboard
      </h1>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">
            TICKET SUMMARY
          </h3>
          <ul className="space-y-2">
            {summary.map((item, index) => (
              <li
                key={index}
                className="text-gray-600 text-sm flex justify-between"
              >
                <span>{item.status}</span>
                <span className="font-semibold">{item.count}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* ticket by priority */}
        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">
            TICKET PRIORITY
          </h3>
          <ul className="space-y-2">
            {priorities.map((item, index) => (
              <li
                key={index}
                className="text-gray-600 text-sm flex justify-between"
              >
                <span>{item.priority}</span>
                <span className="font-bold">{item.count}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* ticket by status */}
        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">
            TASK STATUS
          </h3>
          <ul className="space-y-2">
            {taskStatuses.map((item, index) => (
              <li
                key={index}
                className="text-gray-600 text-sm flex justify-between"
              >
                <span>{item.status}</span>
                <span className="font-bold">{item.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Line Chart */}
      <h2 className="text-2xl font-extrabold text-gray-500 mt-12 ml-2">
        LINE CHART - TICKET SUMMARY
      </h2>
      <LineChart
        className="mt-4"
        width={900}
        height={250}
        data={lineChartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="count" stroke="#2e23f8ff" />
      </LineChart>
      {/* Bar Chart */}
      <h2 className="text-2xl font-extrabold text-gray-500 mt-12 ml-2">
        BAR CHART - TICKET PRIORITY
      </h2>
      <BarChart
        className="mt-4"
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        width={900}
        height={250}
        data={pieChartData}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="pv" fill="#2419ffff" />
        <Bar dataKey="uv" fill="#17e265ff" />
      </BarChart>
      ;
    </div>
  );
}
