import { Outlet, useLocation } from "react-router-dom";
import Navigation from "./pages/Auth/Navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/Footer";
import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect } from "react";

function App() {
  const location = useLocation();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

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
      
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500
          transform origin-left z-50"
        style={{ scaleX }}
      />

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

      {/* Floating Navigation Dots */}
      <motion.div 
        className="fixed right-8 top-1/2 transform -translate-y-1/2 space-y-4 z-40
          hidden lg:flex flex-col items-center"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        {["home", "shop", "cart", "contact"].map((section, index) => (
          <motion.a
            key={section}
            href={`#${section}`}
            className="w-3 h-3 rounded-full bg-purple-500/50 hover:bg-purple-500 
              transition-colors duration-300 cursor-pointer"
            whileHover={{ scale: 1.5 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
          />
        ))}
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center
          gap-2 text-white/50 font-mono text-sm hidden lg:flex"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <svg 
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
        <span>Scroll</span>
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