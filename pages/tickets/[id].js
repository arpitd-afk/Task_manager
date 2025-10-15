import { useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "../../components/Sidebar";
import Navbar from "@/components/Navbar";
import TicketDetail from "@/components/TicketDetail";
import Header from "@/components/Header";

export default function TicketDetailPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      {/* <Navbar /> */}
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-4">
          <TicketDetail />
        </main>
      </div>
    </div>
  );
}
