import { useEffect, useState } from "react";
import Link from "next/link";
import Pagination from "./Pagination";
import { deleteUser, getAllUsers } from "@/helper/User";
import { IoIosAddCircle } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useRouter } from "next/router";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers();
        setUsers(res.data.data || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers(currentPage);
  }, [currentPage]);
  const handleDelete = async (id) => {
    if (confirm("Are you sure?")) {
      try {
        await deleteUser(id);
        setUsers(users.filter((user) => user.id !== id));
      } catch (error) {
        console.error("Error deleting user:", error);
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
          <IoIosAddCircle title="Add User" />
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
                <button
                  onClick={() => router.push(`/users/${user.id}`)}
                  className="text-white text-md bg-blue-500 p-1.5 cursor-pointer rounded hover:bg-blue-600 mr-2"
                >
                  <FaRegEdit title="Edit User" />
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-600 hover:bg-red-700 text-white p-1.5 cursor-pointer rounded"
                >
                  <MdDelete title="Delete User" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        totalItems={totalPages * ITEMS_PER_PAGE}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
