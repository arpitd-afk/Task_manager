import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { IoIosArrowRoundBack } from "react-icons/io";
import { getUserByID } from "@/helper/User";

export default function UserDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!id)
      return (
        <div className="justify-center items-center text-gray-700 text-2xl">
          User ID not found
        </div>
      );
    const fetchUser = async () => {
      try {
        const res = await getUserByID(id);
        setUser(res.data[0]);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUser();
  }, [id]);

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );

  return (
    <div className="py-2">
      <button
        onClick={() => router.push("/users")}
        className="justify-start text-gray-700 text-3xl cursor-pointer rounded md:ml-66"
      >
        <IoIosArrowRoundBack />
      </button>
      <div className="flex items-center justify-center md:ml-80 p-4">
        <div className="max-w-2xl w-full bg-white p-6 py-10 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-gray-500 mb-6 text-center underline">
            USER DETAILS
          </h2>
          <div className="space-y-4">
            <div className="flex">
              <p className="font-semibold text-gray-600">User ID:</p>
              <p className="text-gray-500 ml-2">{user.id}</p>
            </div>
            <div className="flex">
              <p className="font-semibold text-gray-600">Name:</p>
              <p className="text-gray-500 ml-2">{user.name}</p>
            </div>
            <div className="flex">
              <p className="font-semibold text-gray-600">Email:</p>
              <p className="text-gray-500 ml-2">{user.email}</p>
            </div>
            <div className="flex">
              <p className="font-semibold text-gray-600">Role:</p>
              <p className="text-gray-500 ml-2">{user.role}</p>
            </div>
            <div className="flex">
              <p className="font-semibold text-gray-600">Created At:</p>
              <p className="text-gray-500 ml-2">
                {Date(user.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
