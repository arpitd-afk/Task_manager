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
    <header className="bg-gray-900 text-white px-6 py-4 fixed left-0 right-0 top-0 z-50 mb-20 ml-64">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left content */}
        <div className="flex items-center space-x-3">
          {/* {user && (
            <div className="w-10 h-10 rounded-full bg-white text-gray-800 flex items-center justify-center font-bold text-lg">
              {user.name?.[0]?.toUpperCase() || "U"}
            </div>
          )} */}
          <div>
            {/* <p className="text-2xl text-white font-bold">Task Manager</p> */}
            {/* {user && (
              <p className="text-lg font-semibold text-white tracking-wide">
                {user.name || "User"}
              </p>
            )} */}
          </div>
        </div>

        {/* Right side logout button */}
        <nav className="flex items-center space-x-6">
          <button
            onClick={logout}
            className="flex items-center space-x-2 px-3 py-2 cursor-pointer rounded-lg  text-white  font-medium hover:from-gray-600 hover:to-gray-600 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none"
          >
            {/* <IoMdLogOut className="text-2xl" /> */}
            {/* <span className="hidden sm:inline">Logout</span> */}
          </button>
        </nav>
      </div>
    </header>
  );
}
