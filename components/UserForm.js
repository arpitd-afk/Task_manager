import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserByID, updateUser } from "@/helper/User";
import { ArrowLeft, User, Save } from "lucide-react";

export default function UserForm({ userId }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "User",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!userId) return;
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await getUserByID(userId);
        const user = res.data[0] || {};
        setFormData({
          name: user.name || "",
          email: user.email || "",
          role: user.role || "User",
        });
      } catch (err) {
        alert("Failed to load User.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      alert("Name and email are required.");
      return;
    }

    setSaving(true);
    try {
      await updateUser(userId, formData);
      router.push("/users");
    } catch (err) {
      alert("Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <User className="w-8 h-8 text-indigo-600" />
              Edit User
            </h1>
          </div>

          {loading ? (
            <FormSkeleton />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Alex Johnson"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="alex@company.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                >
                  <option value="Admin">Admin</option>
                  <option value="Agent">Agent</option>
                  <option value="User">User</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => router.push("/users")}
                  className="px-4 py-2.5 cursor-pointer border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2.5 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// Skeleton show when page data is loading
const FormSkeleton = () => (
  <div className="space-y-10 animate-pulse">
    <div className="h-10 bg-gray-200 rounded-xl"></div>
    <div className="h-10 bg-gray-200 rounded-xl"></div>
    <div className="h-12 bg-gray-200 rounded-xl"></div>
    <div className="flex justify-end gap-3">
      <div className="h-12 w-28 bg-gray-200 rounded-xl"></div>
      <div className="h-12 w-36 bg-gray-200 rounded-xl"></div>
    </div>
  </div>
);
