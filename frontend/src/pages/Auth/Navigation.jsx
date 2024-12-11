import { useState, useEffect, useRef } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
  AiOutlineMenu,
  AiOutlineClose,
} from "react-icons/ai";
import { FaHeart, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import FavoritesCount from "../Products/FavoritesCount";
import CartCount from "../Products/CartCount";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    setActiveLink(window.location.pathname);
    
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleOptionClick = (action) => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    action();
  };

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const navLinks = [
    { path: "/", label: "Home", Icon: AiOutlineHome },
    { path: "/shop", label: "Shop", Icon: AiOutlineShopping },
    { path: "/cart", label: "Cart", Icon: AiOutlineShoppingCart, extra: <CartCount /> },
    { path: "/favorite", label: "Favorite", Icon: FaHeart, extra: <FavoritesCount /> }
  ];

  return (
    <nav className="fixed w-full top-0 left-0 z-50 bg-black border-b border-zinc-800">
      <div className="max-w-[2000px] mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center h-20 lg:h-28">
          {/* Logo */}
          <Link to="/" className="group">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white font-mono relative overflow-hidden
              transition-all duration-500 group-hover:text-transparent group-hover:bg-clip-text 
              group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:via-red-500 
              group-hover:to-yellow-500 animate-pulse">
              NILASH
            </h1>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden text-white p-2 hover:text-purple-500 transition-colors duration-200"
          >
            {mobileMenuOpen ? (
              <AiOutlineClose className="text-2xl" />
            ) : (
              <AiOutlineMenu className="text-2xl" />
            )}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-16">
            {navLinks.map(({ path, label, Icon, extra }) => (
              <Link
                key={path}
                to={path}
                className={`group relative py-2 ${
                  activeLink === path ? 'text-purple-500' : 'text-zinc-400'
                }`}
                onClick={() => setActiveLink(path)}
              >
                <div className="flex items-center space-x-2 transform transition-all duration-300 
                  group-hover:translate-y-[-2px]">
                  <Icon className={`text-2xl transition-transform duration-300 
                    ${activeLink === path ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="tracking-wider text-base font-medium font-mono">{label}</span>
                  {extra}
                </div>
                <span className={`absolute bottom-0 left-0 w-full h-0.5 transform origin-left 
                  transition-all duration-300 ${
                    activeLink === path 
                      ? 'scale-x-100 bg-purple-500 shadow-glow-purple' 
                      : 'scale-x-0 bg-zinc-400'
                  } group-hover:scale-x-100`} />
              </Link>
            ))}
          </div>

          {/* Desktop User Menu */}
          <div className="hidden lg:flex items-center">
            {userInfo ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-3 bg-zinc-900/50 px-6 py-3 rounded-lg 
                    hover:bg-zinc-800/50 transition-all duration-300 border border-zinc-800
                    hover:border-purple-500/50"
                >
                  <FaUser className="text-purple-500 text-xl" />
                  <span className="text-zinc-300 font-mono text-lg">{userInfo.username}</span>
                  <svg
                    className={`w-5 h-5 text-zinc-300 transform transition-transform duration-300 
                      ${dropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-black border border-zinc-800 
                    rounded-lg shadow-xl animate-fadeIn">
                    <div className="py-2">
                      {userInfo.isAdmin && (
                        <>
                          {[
                            ["Dashboard", "/admin/dashboard"],
                            ["Products", "/admin/productlist"],
                            ["Category", "/admin/categorylist"],
                            ["Orders", "/admin/orderlist"],
                            ["Users", "/admin/userlist"],
                          ].map(([label, path]) => (
                            <Link
                              key={path}
                              to={path}
                              onClick={() => setDropdownOpen(false)}
                              className="block px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-900 
                                hover:text-purple-500 transition-all duration-200 font-mono"
                            >
                              {label}
                            </Link>
                          ))}
                          <div className="border-t border-zinc-800 my-1"></div>
                        </>
                      )}
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-900 
                          hover:text-purple-500 transition-all duration-200 font-mono"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => handleOptionClick(logoutHandler)}
                        className="w-full text-left px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-900 
                          hover:text-purple-500 transition-all duration-200 font-mono"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-6">
                <Link
                  to="/login"
                  className="flex items-center space-x-2 text-zinc-400 hover:text-purple-500 
                    transition-all duration-300 font-mono group text-lg"
                >
                  <AiOutlineLogin className="text-2xl transform transition-transform duration-300 
                    group-hover:rotate-12" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-2 bg-purple-500 text-white px-6 py-3 
                    rounded-lg hover:bg-purple-600 transition-all duration-300 font-mono text-lg
                    transform hover:translate-y-[-2px] hover:shadow-lg hover:shadow-purple-500/25"
                >
                  <AiOutlineUserAdd className="text-2xl" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          ref={mobileMenuRef}
          className={`lg:hidden fixed inset-0 top-20 bg-black transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col p-4 h-full overflow-y-auto">
            {/* Navigation Grid for Mobile/Tablet */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {navLinks.map(({ path, label, Icon, extra }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => {
                    setActiveLink(path);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-4 px-4 py-4 ${
                    activeLink === path ? 'text-purple-500 bg-zinc-900/50' : 'text-zinc-400'
                  } hover:bg-zinc-900 rounded-lg transition-colors duration-200`}
                >
                  <Icon className="text-2xl" />
                  <span className="font-mono">{label}</span>
                  {extra && <span className="ml-auto">{extra}</span>}
                </Link>
              ))}
            </div>

            {/* User Section for Mobile/Tablet */}
            {userInfo ? (
              <div className="mt-4 border-t border-zinc-800 pt-4">
                <div className="px-4 py-2">
                  <div className="flex items-center space-x-2 text-purple-500 mb-4">
                    <FaUser />
                    <span className="font-mono">{userInfo.username}</span>
                  </div>
                  
                  {userInfo.isAdmin && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      {[
                        ["Dashboard", "/admin/dashboard"],
                        ["Products", "/admin/productlist"],
                        ["Category", "/admin/categorylist"],
                        ["Orders", "/admin/orderlist"],
                        ["Users", "/admin/userlist"],
                      ].map(([label, path]) => (
                        <Link
                          key={path}
                          to={path}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center space-x-2 text-zinc-400 hover:text-purple-500 
                            hover:bg-zinc-900 rounded-lg px-4 py-2 transition-colors duration-200 font-mono"
                        >
                          {label}
                        </Link>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-2 text-zinc-400 hover:text-purple-500 
                        hover:bg-zinc-900 rounded-lg px-4 py-2 transition-colors duration-200 font-mono"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => handleOptionClick(logoutHandler)}
                      className="flex items-center space-x-2 text-zinc-400 hover:text-purple-500 
                        hover:bg-zinc-900 rounded-lg px-4 py-2 transition-colors duration-200 font-mono text-left"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 border-t border-zinc-800 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 text-zinc-400 hover:text-purple-500 
                      hover:bg-zinc-900 rounded-lg px-4 py-2 transition-colors duration-200 font-mono"
                  >
                    <AiOutlineLogin className="text-xl" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 bg-purple-500 text-white 
                      hover:bg-purple-600 rounded-lg px-4 py-2 transition-colors duration-200 font-mono"
                  >
                    <AiOutlineUserAdd className="text-xl" />
                    <span>Register</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .shadow-glow-purple {
          box-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
        }
      `}</style>
    </nav>
  );
};

export default Navigation;