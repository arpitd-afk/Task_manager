import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../lib/api";
import Pagination from "./Pagination";

export default function UserList() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/allusers");
        setUsers(res.data.data || []);
      } catch (error) {
        console.error("Error Fetching Users:", error);
      }
    };
    fetchUsers();
  }, []);
  const handleDelete = async (id) => {
    if (confirm("Are You Sure?")) {
      try {
        await api.delete(`/deleteuser/${id}`);
        setUsers(users.filter((user) => user.id !== id));
      } catch (error) {
        console.error("Error Deleting User:", error);
      }
    }
  };
  return (
    <div className="p-4 ml-64">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold text-gray-500 mb-4">USERS</h2>
        <Link
          href="/users/create"
          className="bg-green-500 text-white p-2 rounded mb-4 inline-block"
        >
          Add User
        </Link>
      </div>
      <table className="w-full border-collapse bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">NAME</th>
            <th className="p-2 text-left">EMAIL</th>
            <th className="p-2 text-left">ROLE</th>
            <th className="p-2 text-left">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-gray-200">
              <td className="p-2">{user.id}</td>
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.role}</td>

              <td className="p-2">
                <Link
                  href={`/users/${user.id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 cursor-pointer rounded mr-2"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-600 hover:bg-red-700 text-white p-1 cursor-pointer rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination />
    </div>
  );
}
