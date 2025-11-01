import { useState } from "react";
import { useRouter } from "next/router";
import { signupUser } from "@/helper/Auth";
import { IoIosArrowRoundBack } from "react-icons/io";

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
    <div className="md:ml-66">
      <button
        onClick={() => router.push("/users")}
        className="justify-start text-gray-700 text-3xl cursor-pointer rounded "
      >
        <IoIosArrowRoundBack />
      </button>
      <form
        onSubmit={handleSubmit}
        className="p-8 w-120 mx-auto bg-gray-100 rounded"
      >
        <h2 className="text-3xl text-gray-500 font-bold mb-4">CREATE USER</h2>
        <div className="mb-4">
          <label className="block text-md font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 text-gray-700 border border-gray-300 bg-white rounded"
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
            className="w-full p-2 text-gray-700 border border-gray-300 bg-white rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-md font-medium">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 text-gray-700 border rounded border-gray-300 bg-white"
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
            className="w-full p-2 text-gray-700 border rounded border-gray-300 bg-white"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white p-2.5 w-20 rounded hover:bg-blue-700 cursor-pointer"
        >
          Save
        </button>
      </form>
    </div>
  );
}
