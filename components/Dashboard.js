import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  getTaskStatus,
  getTicketPriority,
  getTicketSummary,
} from "@/helper/Dashboard";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function Dashboard() {
  const { getUserRole } = useAuth();
  const [summary, setSummary] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [taskStatuses, setTaskStatuses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sumRes = await getTicketSummary();
        setSummary(sumRes.data.summary || []);

        const priRes = await getTicketPriority();
        setPriorities(priRes.data.ticketsByPriority || []);

        const taskRes = await getTaskStatus();
        setTaskStatuses(taskRes.data.tasksByStatus || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchData();
  }, []);

  const lineChartData = summary.map((item) => ({
    name: item.status,
    count: item.count,
  }));

  const barChartData = priorities.map((item) => ({
    name: item.priority,
    value: item.count,
  }));

  const pieChartData = taskStatuses.map((item) => ({
    name: item.status,
    value: item.count,
  }));

  return (
    <div className="md:ml-66">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-500 mb-6 md:mb-8">
        {getUserRole() || "User"} - Dashboard
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        {/* Ticket Summary */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg md:text-xl font-semibold text-center text-gray-700 mb-3">
            TICKET SUMMARY
          </h3>
          <ul className="space-y-2 text-sm">
            {summary.map((item, index) => (
              <li key={index} className="flex justify-between text-gray-600">
                <span>{item.status}</span>
                <span className="font-semibold text-blue-600">
                  {item.count}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Ticket Priority */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg md:text-xl font-semibold text-center text-gray-700 mb-3">
            TICKET PRIORITY
          </h3>
          <ul className="space-y-2 text-sm">
            {priorities.map((item, index) => (
              <li key={index} className="flex justify-between text-gray-600">
                <span>{item.priority}</span>
                <span className="font-bold text-indigo-600">{item.count}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Task Status */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg md:text-xl font-semibold text-center text-gray-700 mb-3">
            TASK STATUS
          </h3>
          <ul className="space-y-2 text-sm">
            {taskStatuses.map((item, index) => (
              <li key={index} className="flex justify-between text-gray-600">
                <span>{item.status}</span>
                <span className="font-bold text-green-600">{item.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Charts */}
      <div className="space-y-10">
        {/* Line Chart - Ticket Summary */}
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-700 mb-4">
            LINE CHART - TICKET SUMMARY
          </h2>
          <div className="bg-white p-4 rounded-xl">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={lineChartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart - Ticket Priority */}
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-700 mb-4">
            BAR CHART - TICKET PRIORITY
          </h2>
          <div className="bg-white p-4 rounded-xl">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={barChartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - Task Status */}
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-700 mb-4">
            PIE CHART - TASK STATUS
          </h2>
          <div className="bg-white p-4 rounded-xl">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
