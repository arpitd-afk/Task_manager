import Link from "next/link";
import { useAuth } from "../lib/auth";

export default function Sidebar() {
  const { getUserRole } = useAuth();
  return (
    <aside className="w-64  h-screen bg-gray-200 p-4 shadow-lg fixed border-r border-gray-200">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">TASK MANAGER</h1>
      </div>
      <nav className="space-y-4">
        <Link
          href="/dashboard"
          className="block p-3 text-gray-700 bg-gray-50 hover:text-white hover:bg-gray-400 rounded-lg transition"
        >
          DASHBOARD
        </Link>
        <Link
          href="/tickets"
          className="block p-3 text-gray-700 bg-gray-50 hover:text-white hover:bg-gray-400 rounded-lg transition"
        >
          TICKETS
        </Link>
        <Link
          href="/tasks"
          className="block p-3 text-gray-700 bg-gray-50 hover:text-white hover:bg-gray-400 rounded-lg transition"
        >
          TASKS
        </Link>
        <Link
          href="/notifications"
          className="block p-3 text-gray-700 bg-gray-50 hover:text-white hover:bg-gray-400 rounded-lg transition"
        >
          NOTIFICATIONS
        </Link>
        {(getUserRole() === "Admin" || getUserRole() === "Agent") && (
          <Link
            href="/users"
            className="block p-3 text-gray-700 bg-gray-50 hover:text-white hover:bg-gray-400 rounded-lg transition"
          >
            USERS
          </Link>
        )}
      </nav>
    </aside>
  );
}
