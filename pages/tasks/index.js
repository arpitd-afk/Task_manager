import { useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "../../components/Sidebar";
import Navbar from "@/components/Navbar";
import TaskList from "@/components/TaskList";
import { isAuthenticated } from "@/lib/auth";
import Header from "@/components/Header";
import TaskDash from "@/components/TaskDash";

export default function TasksPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      {/* <Navbar /> */}
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-4">
          {/* <TaskList /> */}
          <TaskDash />
        </main>
      </div>
    </div>
  );
}
