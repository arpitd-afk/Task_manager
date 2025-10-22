import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import UserForm from "@/components/UserForm";

export default function CreateUserPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main>
          <UserForm />
        </main>
      </div>
    </div>
  );
}
