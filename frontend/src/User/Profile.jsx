import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setCredientials } from "../../src/redux/features/auth/authSlice";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaShoppingBag 
} from "react-icons/fa";
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
        dispatch(setCredientials(res));
        toast.success("Profile Updated Successfully");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 0.5,
          type: "spring",
          stiffness: 300
        }}
        className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl shadow-indigo-500/20 border border-gray-700 overflow-hidden"
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                delay: 0.3,
                type: "spring",
                stiffness: 300
              }}
              className="mx-auto w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 
                rounded-full flex items-center justify-center mb-4 shadow-lg"
            >
              <FaUser className="text-4xl text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white">
              Update Profile
            </h2>
            <p className="text-gray-400 mt-2">
              Manage your account settings
            </p>
          </div>

          <form onSubmit={submitHandler} className="space-y-6">
            {/* Username Input */}
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FaUser />
              </div>
              <input
                type="text"
                placeholder="Username"
                className="w-full pl-12 pr-4 py-3 bg-gray-700 text-white 
                  rounded-xl border border-gray-600 focus:border-indigo-500 
                  focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </motion.div>

            {/* Email Input */}
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="relative"
            >
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FaEnvelope />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full pl-12 pr-4 py-3 bg-gray-700 text-white 
                  rounded-xl border border-gray-600 focus:border-indigo-500 
                  focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </motion.div>

            {/* Password Input */}
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="relative"
            >
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FaLock />
              </div>
              <input
                type="password"
                placeholder="New Password"
                className="w-full pl-12 pr-4 py-3 bg-gray-700 text-white 
                  rounded-xl border border-gray-600 focus:border-indigo-500 
                  focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </motion.div>

            {/* Confirm Password Input */}
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="relative"
            >
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FaLock />
              </div>
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full pl-12 pr-4 py-3 bg-gray-700 text-white 
                  rounded-xl border border-gray-600 focus:border-indigo-500 
                  focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                type="submit"
                disabled={loadingUpdateProfile}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white 
                  py-3 rounded-xl hover:from-indigo-600 hover:to-purple-700 
                  transition-all duration-300 flex items-center justify-center gap-2
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingUpdateProfile ? (
                  <span>Updating...</span>
                ) : (
                  <>Update Profile</>
                )}
              </button>

              <Link
                to="/user-orders"
                className="w-full bg-gray-700 text-white py-3 rounded-xl 
                  hover:bg-gray-600 transition-all duration-300 
                  flex items-center justify-center gap-2"
              >
                <FaShoppingBag />
                My Orders
              </Link>
            </motion.div>
          </form>
        </div>
      </motion.div>

      {/* Optional: Background Gradient */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-900 opacity-75"></div>
    </div>
  );
};

export default Profile;