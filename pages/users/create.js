import { useEffect } from "react";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { isAuthenticated } from "../../lib/auth";
import UserForm from "@/components/UserForm";

export default function CreateUserPage() {
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
          <UserForm />
        </main>
      </div>
    </div>
  );
}
