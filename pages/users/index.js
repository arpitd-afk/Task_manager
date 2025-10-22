import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import UserList from "@/components/UserList";

export default function UsersPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-4">
          <UserList />
        </main>
      </div>
    </div>
  );
}
