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
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  getTicketSummary,
  getTicketPriority,
  getTaskStatus,
} from "@/helper/Dashboard";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const LineChartMemo = memo(({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
    </LineChart>
  </ResponsiveContainer>
));

const BarChartMemo = memo(({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="value" fill="#6366f1" />
    </BarChart>
  </ResponsiveContainer>
));

const PieChartMemo = memo(({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        outerRadius={100}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
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
        setError(null);

        const [sumRes, priRes, taskRes] = await Promise.all([
          getTicketSummary(),
          getTicketPriority(),
          getTaskStatus(),
        ]);

        setSummary(sumRes.data.summary || []);
        setPriorities(priRes.data.ticketsByPriority || []);
        setTaskStatuses(taskRes.data.tasksByStatus || []);
      } catch (err) {
        setError("Failed to load dashboard data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const lineChartData = useMemo(
    () =>
      summary.map((item) => ({
        name: item.status,
        count: item.count,
      })),
    [summary]
  );

  const barChartData = useMemo(
    () =>
      priorities.map((item) => ({
        name: item.priority,
        value: item.count,
      })),
    [priorities]
  );

  const pieChartData = useMemo(
    () =>
      taskStatuses.map((item) => ({
        name: item.status,
        value: item.count,
      })),
    [taskStatuses]
  );

  const role = getUserRole() || "User";

  if (loading) {
    return <SkeletonDashboard />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="ml-66">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-500 mb-6 md:mb-8">
        {role} - Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        <SummaryCard title="TICKET SUMMARY" data={summary} color="blue" />
        <SummaryCard
          title="TICKET PRIORITY"
          data={priorities}
          field="priority"
          color="indigo"
        />
        <SummaryCard title="TASK STATUS" data={taskStatuses} color="green" />
      </div>

      {/* Charts */}
      <div className="space-y-10">
        <ChartSection title="LINE CHART - TICKET SUMMARY">
          <LineChartMemo data={lineChartData} />
        </ChartSection>

        <ChartSection title="BAR CHART - TICKET PRIORITY">
          <BarChartMemo data={barChartData} />
        </ChartSection>

        <ChartSection title="PIE CHART - TASK STATUS">
          <PieChartMemo data={pieChartData} />
        </ChartSection>
      </div>
    </div>
  );
}

const SummaryCard = memo(({ title, data, field = "status", color }) => {
  const colorMap = {
    blue: "text-blue-600",
    indigo: "text-indigo-600",
    green: "text-green-600",
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg md:text-xl font-semibold text-center text-gray-700 mb-3">
        {title}
      </h3>
      <ul className="space-y-2 text-sm">
        {data.map((item, i) => (
          <li
            key={item[field] || i}
            className="flex justify-between text-gray-600"
          >
            <span>{item[field] || item.status}</span>
            <span className={`font-bold ${colorMap[color]}`}>{item.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
});

const ChartSection = memo(({ title, children }) => (
  <div>
    <h2 className="text-xl md:text-2xl font-extrabold text-gray-700 mb-4">
      {title}
    </h2>
    <div className="bg-white p-4 rounded-xl">{children}</div>
  </div>
));

// Loading Skeleton
const SkeletonDashboard = () => (
  <div className="ml-66 animate-pulse">
    <div className="h-10 bg-gray-200 rounded w-64 mb-8"></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-xl">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          {[...Array(3)].map((_, j) => (
            <div key={j} className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-10"></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

// Error handling
const ErrorState = ({ message }) => (
  <div className="ml-66 text-center py-10">
    <p className="text-red-600 font-semibold">{message}</p>
    <button
      onClick={() => window.location.reload()}
      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Retry
    </button>
  </div>
);
