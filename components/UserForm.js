import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getUserByID, updateUser } from "@/helper/User";
import { IoIosArrowRoundBack } from "react-icons/io";

export default function UserForm({ userId }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "User",
  });
  const router = useRouter();

  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        try {
          const res = await getUserByID(userId);
          const user = res.data[0] || {};
          setFormData({
            name: user.name,
            email: user.email,
            role: user.role,
          });
        } catch (error) {
          console.error("Error fetching User data:", error);
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
      await updateUser(userId, formData);
      router.push("/users");
    } catch (error) {
      console.error("Error saving User:", error);
    }
  };

  return (
    <div className="ml-66">
      <button
        onClick={() => router.push("/users")}
        className="justify-start text-gray-700 text-3xl cursor-pointer rounded "
      >
        <IoIosArrowRoundBack />
      </button>
      <form
        onSubmit={handleSubmit}
        className="p-8 w-120 mx-auto bg-gray-100 rounded mt-20"
      >
        <h2 className="text-3xl text-gray-500 font-bold mb-4">EDIT USER</h2>
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
            className="w-full p-2 text-gray-700 border rounded border-gray-300 bg-white"
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
