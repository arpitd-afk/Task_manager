import { useState } from "react";
import { useRouter } from "next/router";
import { signupUser } from "@/helper/Auth";
import Link from "next/link";

export default function UserAddForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "User",
    password: "",
  });
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signupUser(formData);
      router.push("/users");
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  return (
    <div className="py-4">
      <Link
        href="/users"
        className="p-2 bg-gray-500 text-white rounded md:ml-70"
      >
        Back
      </Link>
      <form
        onSubmit={handleSubmit}
        className="p-8 w-120 mx-auto bg-gray-100 rounded  md:ml-130"
      >
        <h2 className="text-3xl text-gray-500 font-bold mb-4">CREATE USER</h2>
        <div className="mb-4">
          <label className="block text-md font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 text-gray-700 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-md font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 text-gray-700 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-md font-medium">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 text-gray-700 border rounded"
            required
          >
            <option value="Admin">Admin</option>
            <option value="Agent">Agent</option>
            <option value="User">User</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-md font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 text-gray-700 border rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white p-2.5 w-30 rounded hover:bg-blue-700 cursor-pointer"
        >
          Save
        </button>
      </form>
    </div>
  );
}
