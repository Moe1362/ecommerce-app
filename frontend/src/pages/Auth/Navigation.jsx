import { useState, useEffect, useRef } from 'react';
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineMenu,
  AiOutlineClose,
} from 'react-icons/ai';
import { FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../../redux/api/usersApiSlice';
import { logout } from '../../redux/features/auth/authSlice';
import FavoritesCount from '../Products/FavoritesCount';
import CartCount from '../Products/CartCount';
import { motion, AnimatePresence } from 'framer-motion';
import { CiSearch } from 'react-icons/ci';
import SearchModal from '../../components/SearchModal';

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('/');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home', Icon: AiOutlineHome },
    { path: '/shop', label: 'Shop', Icon: AiOutlineShopping },
    { path: '/cart', label: 'Cart', Icon: null, extra: <CartCount /> },
    {
      path: '/favorite',
      label: 'Favorite',
      Icon: null,
      extra: <FavoritesCount />,
    },
    { path: '/about', label: 'About Us', Icon: null },
  ];

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  const handleOptionClick = (action) => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    action();
  };

  return (
    <>
      <nav
        className="fixed w-full top-0 left-0 z-50 
      bg-gradient-to-br from-gray-900 via-gray-800 to-black 
      border-b border-gray-700/30 
      shadow-2xl"
      >
        {/* Google Fonts Import */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link to="/" className="group">
                <h1
                  className="text-4xl sm:text-5xl font-black font-['Inter']
                bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 
                bg-clip-text text-transparent 
                group-hover:scale-105 transition-transform duration-300
                tracking-wider 
                drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                >
                  NILASH
                </h1>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:flex items-center space-x-8 font-['Inter']"
            >
              {navLinks.map(({ path, label, Icon, extra }) => (
                <Link
                  key={path}
                  to={path}
                  className={`relative group px-3 py-2 text-m font-bold 
                  transition-all duration-300 
                  ${
                    activeLink === path
                      ? 'text-gray-100'
                      : 'text-gray-400 hover:text-gray-100'
                  }`}
                  onClick={() => setActiveLink(path)}
                >
                  <div className="flex items-center space-x-2">
                    {Icon && (
                      <Icon className="text-xl group-hover:scale-110 transition-transform" />
                    )}
                    <span className="relative">
                      {label}
                      <span
                        className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-100 
                      group-hover:w-full transition-all duration-300"
                      ></span>
                    </span>
                    {extra}
                  </div>
                </Link>
              ))}
            </motion.div>

            {/* Desktop User Menu */}
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hidden lg:flex items-center space-x-6 font-['Inter']"
            >
              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-xl 
                bg-gray-800/30 text-gray-300
                border border-gray-700/50 
                hover:bg-gray-800/50 hover:text-gray-100
                transition-all duration-300"
              >
                <CiSearch className="w-5 h-5" />
              </motion.button>

              {userInfo ? (
                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl 
                    bg-gray-800/30 text-white 
                    border border-gray-700/50 
                    hover:bg-gray-800/50 
                    transition-all duration-300"
                  >
                    <FaUser className="text-orange-500" />
                    <span className="font-bold">{userInfo.username}</span>
                  </motion.button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 
                        bg-gray-900/90 backdrop-blur-md 
                        rounded-xl border border-gray-800/50 
                        shadow-2xl overflow-hidden"
                      >
                        <div className="py-1">
                          {userInfo.isAdmin && (
                            <>
                              {[
                                ['Dashboard', '/admin/dashboard'],
                                ['Products', '/admin/productlist'],
                                ['Category', '/admin/categorylist'],
                                ['Orders', '/admin/orderlist'],
                                ['Users', '/admin/userlist'],
                              ].map(([label, path]) => (
                                <Link
                                  key={path}
                                  to={path}
                                  onClick={() => setDropdownOpen(false)}
                                  className="block px-4 py-2 text-sm text-gray-300 
                                  hover:bg-gray-800/30 hover:text-gray-100 
                                  transition-colors duration-300"
                                >
                                  {label}
                                </Link>
                              ))}
                              <div className="border-t border-gray-800/50 my-1" />
                            </>
                          )}
                          <Link
                            to="/profile"
                            onClick={() => setDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-300 
                            hover:bg-gray-800/30 hover:text-gray-100 
                            transition-colors duration-300"
                          >
                            Profile
                          </Link>
                          <button
                            onClick={() => handleOptionClick(logoutHandler)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-300 
                            hover:bg-gray-800/30 hover:text-gray-100 
                            transition-colors duration-300"
                          >
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-300 
                    hover:text-gray-100 
                    transition-colors duration-300"
                  >
                    Login
                  </Link>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/register"
                      className="px-4 py-2 
                      bg-gradient-to-r from-gray-700 to-gray-900 
                      text-white rounded-xl 
                      hover:from-gray-800 hover:to-black 
                      transition-colors duration-300 
                      shadow-lg hover:shadow-xl hover:shadow-gray-500/30"
                    >
                      Register
                    </Link>
                  </motion.div>
                </div>
              )}
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-300 
              hover:text-gray-100 
              transition-colors duration-300"
            >
              {mobileMenuOpen ? (
                <AiOutlineClose className="text-2xl" />
              ) : (
                <AiOutlineMenu className="text-2xl" />
              )}
            </motion.button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="lg:hidden bg-gray-900/95 backdrop-blur-md absolute inset-x-0 top-20 
                shadow-2xl border-b border-gray-800/30 font-['Inter']"
                ref={mobileMenuRef}
              >
                <div className="px-2 pt-2 pb-3 space-y-1">
                  {/* Search bar in mobile menu */}
                  <div className="px-3 py-2">
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false); // Close mobile menu
                        setIsSearchOpen(true); // Open search modal
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg
      bg-gray-800/30 text-gray-300 border border-gray-700/50
      hover:bg-gray-800/50 hover:text-gray-100
      transition-all duration-300"
                    >
                      <CiSearch className="w-5 h-5" />
                      <span className="text-left flex-1">
                        Search products...
                      </span>
                    </button>
                  </div>

                  {navLinks.map(({ path, label, Icon, extra }) => (
                    <Link
                      key={path}
                      to={path}
                      onClick={() => {
                        setActiveLink(path);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium
                      ${
                        activeLink === path
                          ? 'text-gray-100 bg-gray-800/30'
                          : 'text-gray-300 hover:text-gray-100 hover:bg-gray-800/20'
                      } 
                      transition-colors duration-300`}
                    >
                      {Icon && <Icon className="text-xl" />}
                      <span>{label}</span>
                      {extra && <span className="ml-auto">{extra}</span>}
                    </Link>
                  ))}

                  {userInfo ? (
                    <div className="pt-4 border-t border-gray-800/30">
                      <div className="px-3 py-2 text-sm text-gray-100">
                        <FaUser className="inline-block mr-2" />
                        {userInfo.username}
                      </div>
                      {userInfo.isAdmin && (
                        <>
                          {[
                            ['Dashboard', '/admin/dashboard'],
                            ['Products', '/admin/productlist'],
                            ['Category', '/admin/categorylist'],
                            ['Orders', '/admin/orderlist'],
                            ['Users', '/admin/userlist'],
                          ].map(([label, path]) => (
                            <Link
                              key={path}
                              to={path}
                              onClick={() => setMobileMenuOpen(false)}
                              className="block px-3 py-2 text-sm text-gray-300 
                              hover:text-gray-100 hover:bg-gray-800/20 
                              rounded-lg transition-colors duration-300"
                            >
                              {label}
                            </Link>
                          ))}
                        </>
                      )}
                      <Link
                        to="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-3 py-2 text-sm text-gray-300 
                        hover:text-gray-100 hover:bg-gray-800/20 
                        rounded-lg transition-colors duration-300"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => handleOptionClick(logoutHandler)}
                        className="w-full text-left px-3 py-2 text-sm text-gray-300 
                        hover:text-gray-100 hover:bg-gray-800/20 
                        rounded-lg transition-colors duration-300"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="pt-4 border-t border-gray-800/30 grid grid-cols-2 gap-4">
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-4 py-2 text-center text-gray-300 
                        hover:text-gray-100 
                        rounded-lg transition-colors duration-300"
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-4 py-2 text-center 
                        bg-gradient-to-r from-gray-700 to-gray-900 
                        text-white rounded-lg 
                        hover:from-gray-800 hover:to-black 
                        transition-colors duration-300"
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};

export default Navigation;
