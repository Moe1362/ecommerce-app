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
    <div className="relative">
      <ToastContainer />
      
      <Navigation />

      {/* Main Content with Page Transitions */}
      <motion.main 
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="py-20 mt-[3rem]"
      >
        <Outlet />
      </motion.main>

      {/* Reveal Footer on Scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      >
        <Footer />
      </motion.div>

      {/* Corner Gradient Effect */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full 
        filter blur-[100px] pointer-events-none opacity-50" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-pink-500/10 rounded-full 
        filter blur-[100px] pointer-events-none opacity-50" />
    </div>
  );
}

export default App;