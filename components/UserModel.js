import { useEffect, useState } from "react";
import {
  X,
  Eye,
  EyeOff,
  Save,
  User as UserIcon,
  Mail,
  Shield,
  Calendar,
  Badge,
} from "lucide-react";
import { format, parseISO } from "date-fns";

export default function UserModal({ mode, user, onClose, onSave, onDelete }) {
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "User",
    password: "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "User",
        password: "",
      });
    } else {
      setForm({ name: "", email: "", role: "User", password: "" });
    }
    setErrors({});
  }, [user, mode]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "Name required";
    if (!form.email.trim()) err.email = "Email required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) err.email = "Invalid email";
    if (isAdd && !form.password) err.password = "Password required";
    else if (isAdd && form.password.length < 6) err.password = "≥6 chars";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = isAdd
      ? form
      : { name: form.name, email: form.email, role: form.role };
    await onSave(payload);
  };

  const title = isView ? "User Details" : isAdd ? "Add New User" : "Edit User";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <UserIcon className="w-6 h-6 text-indigo-600" />
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 cursor-pointer hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          {isView ? (
            <ViewBody user={user} />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  disabled={isView}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.name ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={isView}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    errors.email ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  disabled={isView}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="Admin">Admin</option>
                  <option value="Agent">Agent</option>
                  <option value="User">User</option>
                </select>
              </div>

              {/* Password */}
              {isAdd && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPwd ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 pr-10 border rounded-lg ${
                        errors.password ? "border-red-300" : "border-gray-300"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-2 top-2 text-gray-500"
                    >
                      {showPwd ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t">
                {!isView && (
                  <button
                    type="submit"
                    className="px-4 cursor-pointer py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-1"
                  >
                    <Save className="w-4 h-4" />
                    {isAdd ? "Create" : "Save"}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// reusable components
function ViewBody({ user }) {
  const roleColors = {
    Admin: "bg-purple-100 text-purple-700",
    Agent: "bg-blue-100 text-blue-700",
    User: "bg-gray-100 text-gray-700",
  };

  const created = user.created_at ? parseISO(user.created_at) : null;
  const joined =
    created && !isNaN(created) ? format(created, "dd MMM yyyy, hh:mm a") : "—";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
          {user.name[0].toUpperCase()}
        </div>
        <div>
          <h3 className="text-lg font-semibold">{user.name}</h3>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <Mail className="w-4 h-4" />
            {user.email}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <Info
          label="User ID"
          icon={<Badge className="w-4 h-4" />}
          value={`#${user.id}`}
        />
        <Info
          label="Role"
          icon={<Shield className="w-4 h-4" />}
          value={
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                roleColors[user.role] || roleColors.User
              }`}
            >
              {user.role}
            </span>
          }
        />
        <Info
          label="Joined"
          icon={<Calendar className="w-4 h-4" />}
          value={joined}
        />
        <Info
          label="Status"
          icon={<UserIcon className="w-4 h-4" />}
          value={<span className="text-green-600 font-medium">Active</span>}
        />
      </div>
    </div>
  );
}

function Info({ label, icon, value }) {
  return (
    <div>
      <p className="text-gray-600 flex items-center gap-1 mb-1">
        {icon} {label}
      </p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
