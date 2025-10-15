import { useEffect, useState } from "react";
import { logout } from "../lib/auth";
import { jwtDecode } from "jwt-decode";

export default function Header() {
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
        console.error("Failed to decode token:", error);
      }
    }
    fetchUserFromToken();
  }, []);

  return (
    <header className="bg-gray-600 text-white p-4 shadow-md ml-64">
      <div className="container mx-auto flex justify-between items-center">
        {user && (
          <span className="text-lg font-semibold mr-8">
            WELCOME, {user.name || "User"}...
          </span>
        )}{" "}
        <nav className="flex space-x-4 items-center">
          <button onClick={logout} className="hover:underline text-lg">
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
