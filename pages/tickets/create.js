import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import TicketForm from "../../components/TicketForm";

export default function CreateTicketPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main>
          <TicketForm />
        </main>
      </div>
    </div>
  );
}
