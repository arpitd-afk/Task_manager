import Sidebar from "../../components/Sidebar";
import Header from "@/components/Header";
import TaskDash from "@/components/TaskDash";

export default function TasksPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-4 py-15">
          <TaskDash />
        </main>
      </div>
    </div>
  );
}
