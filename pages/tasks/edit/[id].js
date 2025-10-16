import TaskForm from "@/components/TaskForm";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import { useRouter } from "next/router";

export default function EditTaskPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main>
          <TaskForm taskId={id} />
        </main>
      </div>
    </div>
  );
}
