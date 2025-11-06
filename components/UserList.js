import { useEffect, useState } from "react";
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  Shield,
  Mail,
  User as UserIcon,
} from "lucide-react";
import { deleteUser, getAllUsers, updateUser } from "@/helper/User";
import { signupUser } from "@/helper/Auth";
import UserModal from "./UserModel";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, mode: "", user: null });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      setUsers(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openModal = (mode, user = null) => setModal({ open: true, mode, user });
  const closeModal = () => setModal({ open: false, mode: "", user: null });

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;
    try {
      await deleteUser(id);
      setUsers((p) => p.filter((u) => u.id !== id));
    } catch (e) {
      alert("Delete failed");
    }
  };

  const handleSave = async (payload) => {
    try {
      if (modal.mode === "add") {
        await signupUser(payload);
      } else {
        await updateUser(modal.user.id, payload);
      }
      await fetchUsers();
      closeModal();
    } catch (e) {
      alert(
        modal.mode === "add"
          ? "Create failed – email may exist"
          : "Update failed"
      );
    }
  };

  const getRoleBadge = (role) => {
    const styles = {
      Admin: "bg-purple-100 text-purple-700",
      Agent: "bg-blue-100 text-blue-700",
      User: "bg-gray-100 text-gray-700",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          styles[role] || styles.User
        }`}
      >
        <Shield className="w-3 h-3 inline mr-1" />
        {role}
      </span>
    );
  };

  return (
    <div className="min-h-screen py-2 px-2 ml-64">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">USERS:</h1>
        <button
          onClick={() => openModal("add")}
          className="flex cursor-pointer items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-md hover:shadow-lg transition"
        >
          <Plus className="w-5 h-5" />
          Add User
        </button>
      </div>

      {loading ? (
        <SkeletonGrid />
      ) : users.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md hover:border-gray-300 transition-all group"
            >
              <div
                onClick={() => openModal("view", user)}
                className="flex items-center gap-4 mb-4 cursor-pointer"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow">
                  {user.name[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {user.email}
                  </p>
                </div>
              </div>

              <div
                onClick={() => openModal("view", user)}
                className="mb-4 cursor-pointer"
              >
                {getRoleBadge(user.role)}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-500">ID: {user.id}</span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <ActionBtn
                    icon={<Eye className="w-4 h-4" />}
                    onClick={() => openModal("view", user)}
                    title="View"
                    color="indigo"
                  />
                  <ActionBtn
                    icon={<Edit className="w-4 h-4" />}
                    onClick={() => openModal("edit", user)}
                    title="Edit"
                    color="blue"
                  />
                  <ActionBtn
                    icon={<Trash2 className="w-4 h-4" />}
                    onClick={() => handleDelete(user.id)}
                    title="Delete"
                    color="red"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal.open && (
        <UserModal
          mode={modal.mode}
          user={modal.user}
          onClose={closeModal}
          onSave={handleSave}
          onDelete={
            modal.mode === "edit" ? () => handleDelete(modal.user.id) : null
          }
        />
      )}
    </div>
  );
}

const ActionBtn = ({ icon, onClick, color, title }) => {
  const colors = {
    indigo: "hover:bg-indigo-50 text-indigo-600",
    blue: "hover:bg-blue-50 text-blue-600",
    red: "hover:bg-red-50 text-red-600",
  };
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-2.5 rounded-lg transition-all ${colors[color]} cursor-pointer hover:scale-110`}
    >
      {icon}
    </button>
  );
};

const SkeletonGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div>
            <div className="h-5 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-40 mt-2"></div>
          </div>
        </div>
        <div className="h-8 bg-gray-200 rounded-full w-20"></div>
      </div>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="text-center py-16">
    <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
    <p className="text-xl text-gray-600">No users found</p>
    <p className="text-gray-500 mt-2">Click “Add User” to get started</p>
  </div>
);
