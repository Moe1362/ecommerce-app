import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredientials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import back from '../../assets/back1.jpg';  // Change this to your image file

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isMount, setIsMount] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    setIsMount(true);
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredientials({ ...res }));
      navigate(redirect);
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  return (
    <div className="relative min-h-screen font-mono flex justify-center items-center">
      {/* Background Image with Blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${back})`,
          filter: 'blur(4px)',
          transform: 'scale(1.1)',  // Prevents blur edges from showing
        }}
      />

     

      {/* Login Form */}
      <div 
        className={`relative z-10 w-full max-w-md transform transition-all duration-700 px-4 ${
          isMount ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <div className="backdrop-blur-md bg-black/30 rounded-xl border border-white/10 shadow-2xl overflow-hidden">
          <div className="p-8">
            <h1 className="text-4xl font-bold mb-8 text-white text-center">
              Welcome Back
            </h1>
            <form onSubmit={submitHandler} className="space-y-6">
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
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
            <div className="mt-8 text-center">
              <p className="text-white/70">
                New Customer?{" "}
                <Link
                  to={redirect ? `/register?redirect=${redirect}` : "/register"}
                  className="text-white hover:text-white/80 underline transition-colors duration-300"
                >
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;