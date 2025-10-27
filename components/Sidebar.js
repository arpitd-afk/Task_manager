import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../lib/auth";

export default function Sidebar() {
  const { getUserRole } = useAuth();
  const pathname = usePathname();

  const getLinkClassName = (href) => {
    const isActive = pathname === href;
    return `block p-3 rounded-lg transition ${
      isActive
        ? "bg-gray-400 text-white font-semibold"
        : "text-gray-700 bg-gray-50 hover:text-white hover:bg-gray-400"
    }`;
  };

  return (
    <aside className="w-64 h-screen bg-gray-200 p-4 shadow-lg fixed border-r border-gray-200">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 font-sarif">
          TASK MANAGER
        </h1>
      </div>
      <nav className="space-y-4">
        <Link href="/dashboard" className={getLinkClassName("/dashboard")}>
          DASHBOARD
        </Link>
        <Link href="/tickets" className={getLinkClassName("/tickets")}>
          TICKETS
        </Link>
        <Link href="/tasks" className={getLinkClassName("/tasks")}>
          TASKS
        </Link>
        <Link
          href="/notifications"
          className={getLinkClassName("/notifications")}
        >
          NOTIFICATIONS
        </Link>
        {(getUserRole() === "Admin" || getUserRole() === "Agent") && (
          <Link href="/users" className={getLinkClassName("/users")}>
            USERS
          </Link>
        )}
      </nav>
    </aside>
  );
}
