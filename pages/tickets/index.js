import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import TicketList from "../../components/TicketList";

export default function TicketsPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-4">
          <TicketList />
        </main>
      </div>
    </div>
  );
}
