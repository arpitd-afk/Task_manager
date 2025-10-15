import { useEffect } from "react";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import TicketForm from "../../components/TicketForm";
import Navbar from "@/components/Navbar";
import { isAuthenticated } from "../../lib/auth";

export default function CreateTicketPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      {/* <Navbar /> */}
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-4">
          <TicketForm />
        </main>
      </div>
    </div>
  );
}
