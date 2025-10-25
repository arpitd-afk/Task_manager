import { useEffect, useState } from "react";
import { useAuth } from "../lib/auth";
import { jwtDecode } from "jwt-decode";
import { IoMdLogOut } from "react-icons/io";

export default function Header() {
  const [user, setUser] = useState(null);
  const { logout } = useAuth();

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

  return (
    <header className="bg-gray-600   text-white p-4 shadow-md ml-64">
      <div className="container mx-auto flex justify-between items-center">
        {user && (
          <span className="text-lg font-semibold mr-8">
            Welcome, {user.name || "User"}...
          </span>
        )}{" "}
        <nav className="flex space-x-4 items-center ">
          <button
            onClick={logout}
            className="cursor-pointer text-2xl text-white"
          >
            <IoMdLogOut title="Logout" />
          </button>
        </nav>
      </div>
    </header>
  );
}
