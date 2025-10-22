import { useState } from "react";
import { useRouter } from "next/router";
import api from "../../lib/api";
import { useAuth } from "../../lib/auth";
import Link from "next/link";

export default function Login() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/login", formData);
      login(response.data.token, response.data.user);
      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.statusmessage || "Login Failed");
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
        <h2 className="text-3xl text-center text-gray-500 font-bold mb-4">
          LOGIN
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
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
          className="bg-blue-600 text-xl cursor-pointer text-white p-2 rounded-full hover:bg-blue-700 w-full"
        >
          Login
        </button>
        <p className="mt-4 text-center text-gray-400">
          Don't have an account?
          <Link
            href="/auth/signup"
            className="text-blue-600 hover:text-blue-700 hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
