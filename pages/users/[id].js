// pages/users/[id].js
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import UserForm from "../../components/UserForm";
import { useRouter } from "next/router";

export default function EditUserPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <UserForm userId={id} />
      </div>
    </div>
  );
}
