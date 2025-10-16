import Sidebar from "../../components/Sidebar";
import TicketDetail from "@/components/TicketDetail";
import Header from "@/components/Header";
import { useRouter } from "next/router";
import { isAuthenticated } from "@/lib/auth";
import { useEffect } from "react";

export default function TicketDetailPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth/login");
    }
  }, [router]);

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
