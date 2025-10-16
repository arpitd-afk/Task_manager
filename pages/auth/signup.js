import { useState } from "react";
import { useRouter } from "next/router";
import api from "../../lib/api";
import Link from "next/link";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "User",
    password: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/signup", formData);
      router.push("/auth/login");
    } catch (err) {
      setError(err.response?.data?.statusmessage || "Signup failed");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white rounded shadow-md w-96"
      >
        <h2 className="text-3xl font-bold mb-4 text-center text-gray-500">
          REGISTER
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
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
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 cursor-pointer text-lg text-white p-2 rounded-full hover:bg-blue-700 w-full"
        >
          Register
        </button>
        <p className="mt-4 text-center text-gray-400">
          Already have an account?
          <Link
            href="/auth/login"
            className="text-blue-600 hover:text-blue-700 hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
