import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getTaskById } from "@/helper/Tasks";
import Link from "next/link";

export default function TaskDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [task, setTask] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchTask = async () => {
        try {
          const res = await getTaskById(id);
          setTask(res.data);
        } catch (error) {
          console.error("Error fetching task details:", error);
        }
      };
      fetchTask();
    }
  }, [id]);

  if (!task)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );

  return (
    <div className="py-2">
      <Link
        href="/tickets"
        className="p-2 justify-start bg-gray-500 text-white rounded md:ml-68"
      >
        Back
      </Link>
      <div className="flex items-center justify-center md:ml-80 p-4">
        <div className="max-w-2xl w-full bg-white p-6 py-20  rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-gray-500 mb-6 text-center underline">
            TASK DETAILS
          </h2>
          <div className="space-y-4">
            <div className="flex">
              <p className="font-semibold text-gray-600">Task ID:</p>
              <p className="text-gray-500 ml-2">{task.id}</p>
            </div>
            <div className="flex">
              <p className="font-semibold text-gray-600">Ticket ID:</p>
              <p className="text-gray-500 ml-2">{task.ticket_id}</p>
            </div>
            <div className="flex">
              <p className="font-semibold text-gray-600">Assigned To:</p>
              <p className="text-gray-500 ml-2">{task.assigned_to}</p>
            </div>
            <div className="flex">
              <p className="font-semibold text-gray-600">Title:</p>
              <p className="text-gray-500 ml-2">{task.title}</p>
            </div>
            <div className="flex">
              <p className="font-semibold text-gray-600">Description:</p>
              <p className="text-gray-500 ml-2">{task.description}</p>
            </div>
            <div className="flex">
              <p className="font-semibold text-gray-600">Status:</p>
              <p className="text-gray-500 ml-2">{task.status}</p>
            </div>
            <div className="flex">
              <p className="font-semibold text-gray-600">Created At:</p>
              <p className="text-gray-500 ml-2">
                {new Date(task.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
