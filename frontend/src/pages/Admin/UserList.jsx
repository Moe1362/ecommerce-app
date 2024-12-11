import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import Message from "../../components/Message";
import AdminMenu from "./AdminMenu";

const UserList = () => {
  const { data: users, refetch, error, isLoading } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id).unwrap();
        toast.success("User deleted successfully");
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || error?.error || "Failed to delete user");
      }
    }
  };

  const toggleEdit = (id, name, email) => {
    setEditableUserId(id);
    setEditableUserName(name);
    setEditableUserEmail(email);
  };

  const updateHandler = async (id) => {
    try {
      await updateUser({
        userId: id,
        username: editableUserName,
        email: editableUserEmail,
      });
      setEditableUserId(null);
      refetch();
    } catch (error) {
      toast.error(error.data.message || error.error);
    }
  };

  return (
    <div className="min-h-screen ml-40">
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error?.message}
        </Message>
      ) : (
        <div className="flex flex-col md:flex-row">
          <AdminMenu />
          <div className="w-full md:w-4/5 overflow-x-auto rounded-xl bg-gray-800 shadow-2xl">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-700 text-gray-200">
                  <th className="px-6 py-4 text-left font-semibold">ID</th>
                  <th className="px-6 py-4 text-left font-semibold">Name</th>
                  <th className="px-6 py-4 text-left font-semibold">Email</th>
                  <th className="px-6 py-4 text-left font-semibold">Admin</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {users?.map((user) => (
                  <tr 
                    key={user._id} 
                    className="text-gray-300 hover:bg-gray-700/50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 text-sm">{user._id}</td>
                    <td className="px-6 py-4">
                      {editableUserId === user._id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={editableUserName}
                            onChange={(e) => setEditableUserName(e.target.value)}
                            className="w-full bg-gray-700 text-gray-100 px-3 py-2 rounded-lg 
                              border border-gray-600 focus:border-pink-500 focus:ring-1 
                              focus:ring-pink-500 focus:outline-none transition-colors duration-200"
                          />
                          <button
                            onClick={() => updateHandler(user._id)}
                            className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg
                              transition-colors duration-200"
                          >
                            <FaCheck />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span>{user.username}</span>
                          <button
                            onClick={() => toggleEdit(user._id, user.username, user.email)}
                            className="p-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                          >
                            <FaEdit />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editableUserId === user._id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="email"
                            value={editableUserEmail}
                            onChange={(e) => setEditableUserEmail(e.target.value)}
                            className="w-full bg-gray-700 text-gray-100 px-3 py-2 rounded-lg 
                              border border-gray-600 focus:border-pink-500 focus:ring-1 
                              focus:ring-pink-500 focus:outline-none transition-colors duration-200"
                          />
                          <button
                            onClick={() => updateHandler(user._id)}
                            className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg
                              transition-colors duration-200"
                          >
                            <FaCheck />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span>{user.email}</span>
                          <button
                            onClick={() => toggleEdit(user._id, user.username, user.email)}
                            className="p-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                          >
                            <FaEdit />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.isAdmin ? (
                        <FaCheck className="text-green-500 text-xl" />
                      ) : (
                        <FaTimes className="text-red-500 text-xl" />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {!user.isAdmin && (
                        <button
                          onClick={() => deleteHandler(user._id)}
                          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg
                            transform transition-all duration-200 hover:scale-105
                            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                            focus:ring-offset-gray-800"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;