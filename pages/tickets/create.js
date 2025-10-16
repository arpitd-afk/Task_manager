import { useEffect } from "react";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import TicketForm from "../../components/TicketForm";
import { isAuthenticated } from "../../lib/auth";

export default function CreateTicketPage() {
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
        <main>
          <TicketForm />
        </main>
      </div>
    </div>
  );
}
