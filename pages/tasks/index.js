import { useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "../../components/Sidebar";
import { isAuthenticated } from "@/lib/auth";
import Header from "@/components/Header";
import TaskDash from "@/components/TaskDash";

export default function TasksPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth/login");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-4">
          <TaskDash />
        </main>
      </div>
    </div>
  );
}
