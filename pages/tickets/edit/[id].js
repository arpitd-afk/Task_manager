// pages/tickets/edit/[id].js
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import TicketForm from "../../../components/TicketForm";
import { useRouter } from "next/router";

export default function EditTicketPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <TicketForm ticketId={id} />
      </div>
    </div>
  );
}
