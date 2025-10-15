import { useState, useEffect } from "react";
import api from "../lib/api";
import { useRouter } from "next/router";

export default function UserForm({ userId }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "User",
    password: "",
  });
  const router = useRouter();

  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        try {
          const res = await api.get(`/user/${userId}`);
          const user = res.data[0] || {};
          setFormData({
            name: user.name,
            email: user.email,
            role: user.role,
            password: "",
          });
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      };
      fetchUser();
    }
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (userId) {
        await api.put(`/updateuser/${userId}`, formData);
      } else {
        await api.post("/signup", formData);
      }
      router.push("/users");
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 max-w-md mx-auto bg-white rounded shadow ml-64"
    >
      <h2 className="text-2xl font-bold mb-4">
        {userId ? "Edit" : "Create"} User
      </h2>
      <div className="mb-4">
        <label className="block text-sm font-medium">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="Admin">Admin</option>
          <option value="Agent">Agent</option>
          <option value="User">User</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">
          Password {userId ? "(Leave blank to keep current)" : ""}
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required={!userId}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Save
      </button>
    </form>
  );
}
