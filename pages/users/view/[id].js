import Sidebar from "@/components/Sidebar";
import UserDetail from "@/components/UserDetail";
import Header from "@/components/Header";

export default function TicketDetailPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-4">
          <UserDetail />
        </main>
      </div>
    </div>
  );
}
