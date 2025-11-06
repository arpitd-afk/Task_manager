import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../lib/auth";
import {
  LayoutDashboard,
  Ticket,
  CheckSquare,
  Bell,
  Users,
  LogOut,
} from "lucide-react";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function Sidebar() {
  const { getUserRole, logout } = useAuth();
  const pathname = usePathname();
  const role = getUserRole();

  const [user, setUser] = useState(null);
  useEffect(() => {
    function fetchUserFromToken() {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decodedToken = jwtDecode(token);
          setUser({ name: decodedToken.name });
        }
      } catch (error) {
        console.error("Failed to get User from token:", error);
      }
    }
    fetchUserFromToken();
  }, []);

  const isActive = (path) => pathname?.startsWith(path) ?? false;

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/tickets", label: "Tickets", icon: Ticket },
    { href: "/tasks", label: "Tasks", icon: CheckSquare },
    { href: "/notifications", label: "Notifications", icon: Bell },
  ];

  const adminItems = [{ href: "/users", label: "Users", icon: Users }];

  const NavLink = ({ item }) => {
    const Icon = item.icon;
    const active = isActive(item.href);

    return (
      <Link
        href={item.href}
        className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
          active
            ? "bg-gray-600 text-white shadow-lg"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }`}
      >
        <Icon
          className={`w-5 h-5 ${
            active ? "text-white" : "text-gray-500 group-hover:text-gray-900"
          }`}
        />
        <span className="font-medium">{item.label}</span>
        {active && <div className="ml-auto w-1 h-8 bg-white rounded-full" />}
      </Link>
    );
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 shadow-xl z-50 flex flex-col">
      <div className="p-2 bg-gray-900 border-b border-gray-100">
        <div className="items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-white px-4">
              TASK MANAGER
            </h1>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {menuItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}

        {(role === "Admin" || role === "Agent") && (
          <>
            <div className="my-4 h-px bg-gray-200" />
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Admin
            </p>
            {adminItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </>
        )}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">{role}</p>
              {user && (
                <p className="text-xs text-gray-500">{user.name || "User"}</p>
              )}
            </div>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition"
            title="Logout"
          >
            <LogOut className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>
    </aside>
  );
}
