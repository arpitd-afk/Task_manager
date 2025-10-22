import Sidebar from "../../components/Sidebar";
import TicketDetail from "@/components/TicketDetail";
import Header from "@/components/Header";

export default function TicketDetailPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-4">
          <TicketDetail />
        </main>
      </div>
    </div>
  );
}
