import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaTimes, FaHome, FaList, FaBox, FaUsers, FaShoppingCart, FaLayerGroup } from "react-icons/fa";

const AdminMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { path: "/admin/dashboard", name: "Admin Dashboard", icon: <FaHome size={18} /> },
    { path: "/admin/categorylist", name: "Create Category", icon: <FaLayerGroup size={18} /> },
    { path: "/admin/productlist", name: "Create Product", icon: <FaBox size={18} /> },
    { path: "/admin/allproductslist", name: "All Products", icon: <FaList size={18} /> },
    { path: "/admin/userlist", name: "Manage Users", icon: <FaUsers size={18} /> },
    { path: "/admin/orderlist", name: "Manage Orders", icon: <FaShoppingCart size={18} /> },
  ];

  return (
    <>
      {/* Menu Toggle Button */}
      <button
        className={`${
          isMenuOpen ? "top-[6rem] right-4" : "top-[6rem] right-4"
        } fixed z-50 bg-gray-800 p-3 rounded-xl shadow-lg hover:bg-gray-700 
        transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 
        focus:ring-pink-500 group`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? (
          <FaTimes className="text-white text-xl transition-transform duration-300 
            group-hover:rotate-90" />
        ) : (
          <div className="space-y-1.5 transition-all duration-300 group-hover:space-y-2">
            <div className="w-6 h-0.5 bg-white group-hover:bg-pink-500 
              transition-all duration-300"></div>
            <div className="w-6 h-0.5 bg-white group-hover:bg-pink-500 
              transition-all duration-300 group-hover:w-4"></div>
            <div className="w-6 h-0.5 bg-white group-hover:bg-pink-500 
              transition-all duration-300"></div>
          </div>
        )}
      </button>

      {/* Menu Panel */}
      <div
        className={`fixed top-[5rem] right-0 h-[40rem] bg-gray-900/95 backdrop-blur-md w-72 
        transform transition-all duration-300 ease-in-out z-40 
        shadow-[0_0_20px_rgba(0,0,0,0.3)] border-l border-gray-800
        ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="h-full overflow-y-auto scrollbar-hidden">
          {/* Menu Header */}
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-bold text-white mb-1">Admin Panel</h2>
            <p className="text-gray-400 text-sm">Manage your store</p>
          </div>

          {/* Menu Items */}
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-4 py-3 rounded-lg
                      transition-all duration-300
                      ${isActive 
                        ? 'bg-pink-600/10 text-pink-500' 
                        : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                      }
                    `}
                  >
                    <span className={`transition-transform duration-300 
                      group-hover:scale-110`}>
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.name}</span>
                    
                    {/* Active Indicator */}
                    <span className={`ml-auto transition-transform duration-300
                      ${({ isActive }) => isActive ? 'opacity-100' : 'opacity-0'}
                    `}>
                      •
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Menu Footer */}
          <div className="absolute bottom-0 w-full p-4 border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm">
            <div className="flex items-center justify-between px-4 py-2 rounded-lg
              bg-gradient-to-r from-pink-500/10 to-purple-500/10 text-gray-400">
              <span className="text-sm">Admin Version</span>
              <span className="text-sm font-mono">1.0.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      <div
        onClick={() => setIsMenuOpen(false)}
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300
        ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      />
    </>
  );
};

export default AdminMenu;