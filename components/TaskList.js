import { useEffect, useState } from "react";
import TaskForm from "./TaskForm";
import Pagination from "./Pagination";
import Modal from "./Modal";
import { IoIosAddCircle } from "react-icons/io";
import { FaEye, FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useRouter } from "next/router";
import { deleteTask, getTasksByTicket } from "@/helper/Tasks";

export default function TaskList({ ticketId }) {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 5;
  const router = useRouter();

  const fetchTasks = async () => {
    try {
      const res = await getTasksByTicket(ticketId);
      setTasks(res.data.tasks || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching Tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks(currentPage);
  }, [ticketId, currentPage]);

  const handleDelete = async (id) => {
    if (confirm("Are you sure to delete the Task?")) {
      try {
        await deleteTask(id);
        fetchTasks();
      } catch (error) {
        console.error("Error deleting Task:", error);
      }
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    fetchTasks();
  };

  if (!tasks)
    return (
      <div className="flex items-center p-4 ml-64 justify-center h-screen">
        Loading...
      </div>
    );

  return (
    <div className="mb-8 pt-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-3xl text-gray-500 font-semibold mb-2">
          TASKS LIST:
        </h3>
        <button
          onClick={() => {
            setIsModalOpen(true);
            setEditingTask(null);
          }}
          className="bg-green-600 hover:bg-green-500 cursor-pointer text-white p-2 rounded mb-4"
        >
          <IoIosAddCircle title="Create Task" />
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <TaskForm
          ticketId={ticketId}
          task={editingTask}
          onSuccess={handleSuccess}
        />
      </Modal>

      <table className="w-full border-collapse bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">TITLE</th>
            <th className="p-2 text-left">DESCRIPTION</th>
            <th className="p-2 text-left">ASSIGNED TO</th>
            <th className="p-2 text-left">STATUS</th>
            <th className="p-2 text-left">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr
              key={task.id}
              className="border-b border-gray-200 hover:bg-gray-50"
            >
              <td className="p-2">{task.id}</td>
              <td className="p-2">{task.title}</td>
              <td className="p-2">{task.description}</td>
              <td className="p-2">{task.assigned_to}</td>
              <td className="p-2">{task.status}</td>
              <td className="p-2">
                <button
                  onClick={() => router.push(`/tasks/${task.id}`)}
                  className="text-white bg-purple-600 hover:bg-purple-700 p-1.5 cursor-pointer rounded mr-2"
                >
                  <FaEye title="View Task" />
                </button>

                <button
                  onClick={() => handleEdit(task)}
                  className="bg-blue-600 hover:bg-blue-700 rounded cursor-pointer text-white p-1.5 mr-2"
                >
                  <FaRegEdit title="Update Task" />
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="bg-red-600 hover:bg-red-700 rounded cursor-pointer text-white p-1.5"
                >
                  <MdDelete title="Delete Task" />
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
