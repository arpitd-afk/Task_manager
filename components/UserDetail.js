import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getUserByID } from "@/helper/User";
import { ArrowLeft, Mail, Shield, Calendar, User, Badge } from "lucide-react";
import { format, parseISO } from "date-fns";
import { FaRegEdit } from "react-icons/fa";

export default function UserDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await getUserByID(id);
        setUser(res.data[0]);
      } catch (err) {
        console.error("Failed to load User");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <Skeleton />;
  if (!user) return <NotFound />;

  const roleColors = {
    Admin: "bg-purple-100 text-purple-700",
    Agent: "bg-blue-100 text-blue-700",
    User: "bg-gray-100 text-gray-700",
  };

  const createdAt = user.created_at ? parseISO(user.created_at) : null;
  const displayDate =
    createdAt && !isNaN(createdAt)
      ? format(createdAt, "dd MMM yyyy, hh:mm a")
      : "Unknown Date";

  return (
    <div className="py-2 px-2 ml-64">
      <button
        onClick={() => router.push("/users")}
        className="flex cursor-pointer items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 group transition"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition" />
        <span className="font-medium text-sm">Back to Users</span>
      </button>

      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-500 px-8 py-2 text-white">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-4xl font-bold shadow-lg">
                {user.name[0].toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-indigo-100 mt-1 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItem
                icon={<Badge className="w-5 h-5" />}
                label="User ID"
                value={`#${user.id}`}
              />
              <InfoItem
                icon={<Shield className="w-5 h-5" />}
                label="Role"
                value={
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${
                      roleColors[user.role] || roleColors.User
                    }`}
                  >
                    {user.role}
                  </span>
                }
              />

              <InfoItem
                icon={<Calendar className="w-5 h-5" />}
                label="Joined"
                value={displayDate}
              />
              <InfoItem
                icon={<User className="w-5 h-5" />}
                label="Status"
                value={
                  <span className="text-green-600 font-medium">Active</span>
                }
              />
            </div>

            <div className="mt-2 pt-2 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => router.push(`/users/${user.id}`)}
                className="px-4 py-2.5 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition flex items-center gap-2"
              >
                <FaRegEdit title="Edit User" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable components
const InfoItem = ({ icon, label, value }) => (
  <div>
    <p className="text-sm font-medium text-gray-600 flex items-center gap-2 mb-1">
      {icon}
      {label}
    </p>
    <p className="text-lg text-gray-900">{value}</p>
  </div>
);

// Skeleton show when page data is loading
const Skeleton = () => (
  <div className="py-2 px-2 ml-64">
    <div className="max-w-xl mx-auto">
      <div className="bg-white rounded-2xl p-8 animate-pulse">
        <div className="bg-gray-200 h-32 rounded-2xl mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-7 bg-gray-200 rounded w-32"></div>
            </div>
          ))}
        </div>
        <div className="bg-gray-200 h-12 w-20 mx-auto justify-end right-0 rounded-2xl mb-2 mt-2"></div>
      </div>
    </div>
  </div>
);

// show when user data not found
const NotFound = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center ml-64">
    <div className="text-center">
      <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <p className="text-xl font-semibold text-gray-700">User not found</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
      >
        Retry
      </button>
    </div>
  </div>
);
