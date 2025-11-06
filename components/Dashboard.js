import { useEffect, useMemo, useState, memo } from "react";
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
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  getTicketSummary,
  getTicketPriority,
  getTaskStatus,
} from "@/helper/Dashboard";

const COLORS = ["#6366f1", "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b"];

const LineChartMemo = memo(({ data }) => (
  <ResponsiveContainer width="100%" height={320}>
    <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="4 4" stroke="#f3f4f6" />
      <XAxis dataKey="name" tick={{ fill: "#6b7280" }} />
      <YAxis tick={{ fill: "#6b7280" }} />
      <Tooltip
        contentStyle={{
          backgroundColor: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
        }}
        labelStyle={{ color: "#374151" }}
      />
      <Line
        type="monotone"
        dataKey="count"
        stroke="#6366f1"
        strokeWidth={3}
        dot={{ fill: "#6366f1" }}
      />
    </LineChart>
  </ResponsiveContainer>
));

const BarChartMemo = memo(({ data }) => (
  <ResponsiveContainer width="100%" height={320}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="4 4" stroke="#f3f4f6" />
      <XAxis dataKey="name" tick={{ fill: "#6b7280" }} />
      <YAxis tick={{ fill: "#6b7280" }} />
      <Tooltip
        contentStyle={{
          backgroundColor: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
        }}
      />
      <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
));

const PieChartMemo = memo(({ data }) => (
  <ResponsiveContainer width="100%" height={320}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={100}
        paddingAngle={5}
        dataKey="value"
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        labelStyle={{ fontSize: "14px", fontWeight: "600" }}
      >
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
));

export default function Dashboard() {
  const { getUserRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [taskStatuses, setTaskStatuses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [sumRes, priRes, taskRes] = await Promise.all([
          getTicketSummary(),
          getTicketPriority(),
          getTaskStatus(),
        ]);

        setSummary(sumRes.data.summary || []);
        setPriorities(priRes.data.ticketsByPriority || []);
        setTaskStatuses(taskRes.data.tasksByStatus || []);
      } catch (err) {
        setError("Failed to load Dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const lineChartData = useMemo(
    () => summary.map((i) => ({ name: i.status, count: i.count })),
    [summary]
  );

  const barChartData = useMemo(
    () => priorities.map((i) => ({ name: i.priority, value: i.count })),
    [priorities]
  );

  const pieChartData = useMemo(
    () => taskStatuses.map((i) => ({ name: i.status, value: i.count })),
    [taskStatuses]
  );

  const role = getUserRole() || "User";

  if (loading) return <SkeletonDashboard />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="min-h-screen py-4 px-6 ml-64">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800">{role} Dashboard</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <SummaryCard title="Ticket Summary" items={summary} field="status" />
        <SummaryCard
          title="Tickets By Priority"
          items={priorities}
          field="priority"
        />
        <SummaryCard title="Task Status" items={taskStatuses} field="status" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Line Chart */}
        <ChartCard title="Ticket Status Over Time">
          <LineChartMemo data={lineChartData} />
        </ChartCard>

        {/* Bar Chart */}
        <ChartCard title="Tickets by Priority">
          <BarChartMemo data={barChartData} />
        </ChartCard>

        {/* Pie Chart */}
        <div className="lg:col-span-2">
          <ChartCard title="Task Status Distribution">
            <PieChartMemo data={pieChartData} />
          </ChartCard>
        </div>
      </div>
    </div>
  );
}

// Summary Card
const SummaryCard = memo(({ title, items, field }) => {
  return (
    <div className="bg-white hover:bg-gray-100 rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-center mb-2">
        <h3 className="text-xl font-semibold text-gray-700">{title}</h3>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex justify-between items-center">
            <span className="text-sm text-gray-600 font-medium">
              {item[field] || "Unknown"}
            </span>
            <span className="text-sm font-medium text-gray-800">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

// Chart Card
const ChartCard = memo(({ title, children }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
    <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
    <div className="w-full h-80">{children}</div>
  </div>
));

// Skeleton show when no data found
const SkeletonDashboard = () => (
  <div className="min-h-screen py-2 px-2 ml-64">
    <div className="h-10 bg-gray-200 rounded-lg w-64 mb-10"></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="h-6 bg-gray-200 rounded mb-4 w-32"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((j) => (
              <div key={j} className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-5 bg-gray-300 rounded w-10"></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Error
const ErrorState = ({ message }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center ml-64">
    <div className="text-center">
      <p className="text-red-600 font-medium text-lg">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-5 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
      >
        Retry
      </button>
    </div>
  </div>
);
