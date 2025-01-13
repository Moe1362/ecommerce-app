import { Outlet, useLocation } from "react-router-dom";
import Navigation from "./pages/Auth/Navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/Footer";
import { motion } from "framer-motion";
import { useEffect } from "react";

function App() {
  const location = useLocation();
  
  // Smooth scroll for internal links
  useEffect(() => {
    const handleClick = (e) => {
      const target = e.target;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const id = target.getAttribute('href').slice(1);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="relative bg-black min-h-screen">
      <ToastContainer 
        theme="dark"
        toastClassName="bg-gray-900 text-gray-300 border border-gray-800"
      />
      
      <Navigation />
      
      {/* Main Content with Page Transitions */}
      <motion.main 
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="py-20 mt-[3rem] relative z-10"
      >
        <Outlet />
      </motion.main>
      
      {/* Reveal Footer on Scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
        className="relative z-20"
      >
        <Footer />
      </motion.div>
      
      {/* Subtle Background Effects */}
      <div className="fixed top-0 right-0 w-[400px] h-[400px] 
        bg-gradient-to-br from-gray-800/20 to-gray-900/20 
        rounded-full filter blur-[100px] 
        pointer-events-none opacity-30" />
      
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] 
        bg-gradient-to-br from-gray-800/20 to-gray-900/20 
        rounded-full filter blur-[100px] 
        pointer-events-none opacity-30" />
      
      {/* Subtle Border Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 
        border-4 border-gray-900/50 
        dark:border-gray-700/30 
        mix-blend-overlay"></div>
    </div>
  );
}

export default App;