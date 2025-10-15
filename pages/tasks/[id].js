import Header from "@/components/Header";
import Sidebar from "../../components/Sidebar";
import Navbar from "@/components/Navbar";
import TaskDetail from "@/components/TaskDetail";

export default function TaskDetailPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      {/* <Navbar /> */}
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-4">
          <TaskDetail />
        </main>
      </div>
    </div>
  );
}
