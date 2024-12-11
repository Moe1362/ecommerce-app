import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCredientials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import { Loader2 } from "lucide-react";
import back2 from '../../assets/back2.mp4';

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isMount, setIsMount] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    setIsMount(true);
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const res = await register({ username, email, password }).unwrap();
      dispatch(setCredientials({ ...res }));
      navigate(redirect);
      toast.success("User registered successfully");
    } catch (error) {
      toast.error(error?.data?.message || error.message || "Registration failed");
    }
  };

  return (
    <div className="relative min-h-screen font-mono flex justify-center items-center">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src={back2} type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/40 backdrop-blur-sm" />

      {/* Registration Form */}
      <div 
        className={`relative z-10 w-full max-w-md transform transition-all duration-700 px-4 ${
          isMount ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <div className="backdrop-blur-md bg-black/30 rounded-xl border border-white/10 shadow-2xl overflow-hidden">
          <div className="p-8">
            <h1 className="text-4xl font-bold mb-8 text-white text-center">
              Create Account
            </h1>
            <form onSubmit={submitHandler} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">
                  Username
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white 
                           placeholder-white/50 focus:border-white/40 focus:ring-2 focus:ring-white/20 
                           transition-all duration-300 backdrop-blur-sm"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white 
                           placeholder-white/50 focus:border-white/40 focus:ring-2 focus:ring-white/20 
                           transition-all duration-300 backdrop-blur-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white 
                           placeholder-white/50 focus:border-white/40 focus:ring-2 focus:ring-white/20 
                           transition-all duration-300 backdrop-blur-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white 
                           placeholder-white/50 focus:border-white/40 focus:ring-2 focus:ring-white/20 
                           transition-all duration-300 backdrop-blur-sm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                />
              </div>

              <button
                disabled={isLoading}
                type="submit"
                className="w-full py-3 px-4 rounded-lg bg-white/20 hover:bg-white/30 text-white font-medium
                         border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 
                         transition-all duration-300 backdrop-blur-sm transform hover:scale-[1.02]"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Account...
                  </span>
                ) : (
                  "Register"
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-white/70">
                Already have an account?{" "}
                <Link
                  to={redirect ? `/login?redirect=${redirect}` : "/login"}
                  className="text-white hover:text-white/80 underline transition-colors duration-300"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;