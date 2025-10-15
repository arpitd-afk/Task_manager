import Link from "next/link";
import { getUserRole } from "../lib/auth";

export default function Sidebar() {
  const role = getUserRole();

  return (
    <aside className="w-64 bg-white h-screen p-4 shadow-lg fixed border-r border-gray-200">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-600">Task Manager</h1>
      </div>
      <nav className="space-y-4">
        <Link
          href="/dashboard"
          className="block p-3 text-gray-700 bg-gray-100 hover:text-white hover:bg-gray-400 rounded-lg transition"
        >
          Dashboard
        </Link>
        <Link
          href="/tickets"
          className="block p-3 text-gray-700 bg-gray-100 hover:text-white hover:bg-gray-400 rounded-lg transition"
        >
          Tickets
        </Link>
        <Link
          href="/tasks"
          className="block p-3 text-gray-700 bg-gray-100 hover:text-white hover:bg-gray-400 rounded-lg transition"
        >
          Tasks
        </Link>
        {/* <Link
          href="/notifications"
          className="block p-3 text-gray-700 bg-gray-100 hover:text-white hover:bg-gray-400 rounded-lg transition"
        >
          Notifications
        </Link> */}
        {/* {(role === "Admin" || role === "Agent") && (
          <Link
            href="/users"
            className="block p-3 text-gray-700 bg-gray-100 hover:text-white hover:bg-gray-400 rounded-lg transition"
          >
            Users
          </Link>
        )} */}
      </nav>
    </aside>
  );
}
