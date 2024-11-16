import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setCredientials } from "../../src/redux/features/auth/authSlice";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import { useProfileMutation } from "../../src/redux/api/usersApiSlice";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    setUsername(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.username]);

  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          username,
          email,
          password,
        }).unwrap();
        dispatch(setCredientials(res)); // Corrected this line
        toast.success("Profile Updated Successfully");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 mt-[10rem]">
      {/* Page load animation: Fade-in and slide-up */}
      <div className="flex justify-center align-center md:flex md:space-4 animate-fade-up">
        <div className="md:w-1/3 bg-white p-8 rounded-lg shadow-xl shadow-pink-500/50 transition-all ease-in-out duration-500">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Update Profile
          </h2>

          {/* Form Animation: Add a slight transition to inputs */}
          <form onSubmit={submitHandler} className="space-y-4">
            <div className="mb-4">
              <label className="block text-black mb-2">Username</label>
              <input
                type="text"
                placeholder="Enter Username"
                className="form-input p-4 rounded-sm w-full border transition duration-300 ease-in-out transform hover:scale-105 focus:ring-2 focus:ring-pink-500 shadow-md focus:shadow-lg focus:shadow-pink-500/50"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-black mb-2">Email Address</label>
              <input
                type="email"
                placeholder="Enter Email"
                className="form-input p-4 rounded-sm w-full border transition duration-300 ease-in-out transform hover:scale-105 focus:ring-2 focus:ring-pink-500 shadow-md focus:shadow-lg focus:shadow-pink-500/50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-black mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter Password"
                className="form-input p-4 rounded-sm w-full border transition duration-300 ease-in-out transform hover:scale-105 focus:ring-2 focus:ring-pink-500 shadow-md focus:shadow-lg focus:shadow-pink-500/50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-black mb-2">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm Password"
                className="form-input p-4 rounded-sm w-full border transition duration-300 ease-in-out transform hover:scale-105 focus:ring-2 focus:ring-pink-500 shadow-md focus:shadow-lg focus:shadow-pink-500/50"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="flex justify-between mt-6">
              {/* Hover effect on button */}
              <button
                type="submit"
                className="bg-pink-500 text-black py-2 px-4 rounded hover:bg-pink-600 transition duration-300 ease-in-out transform hover:scale-110 shadow-md hover:shadow-lg hover:shadow-pink-500/50"
              >
                Update
              </button>
              <Link
                to="/user-orders"
                className="bg-pink-600 text-black py-2 px-4 rounded hover:bg-pink-700 transition duration-300 ease-in-out transform hover:scale-110 shadow-md hover:shadow-lg hover:shadow-pink-500/50"
              >
                My Orders
              </Link>
            </div>
          </form>
        </div>
        {loadingUpdateProfile && <Loader />}
      </div>
    </div>
  );
};

export default Profile;
