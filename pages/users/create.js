import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import UserAddForm from "@/components/UserAddForm";

export default function CreateUserPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-4">
          <UserAddForm />
        </main>
      </div>
    </div>
  );
}
