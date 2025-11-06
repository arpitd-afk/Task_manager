import Header from "@/components/Header";
import Sidebar from "../../components/Sidebar";
import TaskDetail from "@/components/TaskDetail";

export default function TaskDetailPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-4 py-15">
          <TaskDetail />
        </main>
      </div>
    </div>
  );
}
