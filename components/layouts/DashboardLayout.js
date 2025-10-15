import { useAuth } from "@/context/authContext";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";

const DashboardLayout = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user === null && router.pathname !== "/auth/login") {
      router.replace("/auth/login");
    }
  }, [loading, user, router]);
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (user === null) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
