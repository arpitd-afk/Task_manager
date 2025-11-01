import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import TaskForm from "@/components/TaskForm";

export default function CreateTaskPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-4">
          <TaskForm />
        </main>
      </div>
    </div>
  );
}
