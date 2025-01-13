import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const FavoritesCount = () => {
  const favorites = useSelector(state => state.favorites);
  const favoriteCount = favorites.length;

  return (
    <div className="relative inline-block">
      {favoriteCount > 0 && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 10 
          }}
          className="absolute -top-2 -right-2 bg-gradient-to-r from-cyan-500 to-blue-600 
            text-white font-bold px-2.5 py-1 rounded-full text-xs shadow-lg 
            animate-pulse hover:animate-none"
        >
          {favoriteCount}
        </motion.div>
      )}
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        whileHover={{ 
          scale: 1.2,
          rotate: [0, -10, 10, 0],
          transition: { 
            duration: 0.5,
            type: "spring",
            stiffness: 300
          }
        }}
        whileTap={{ scale: 0.9 }}
        className="h-7 w-7 text-gray-300 hover:text-cyan-500 
          transition-colors duration-300 cursor-pointer"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ 
            duration: 1,
            type: "spring"
          }}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </motion.svg>
    </div>
  );
};

export default FavoritesCount;