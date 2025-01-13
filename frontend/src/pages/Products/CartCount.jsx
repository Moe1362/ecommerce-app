import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const CartCount = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const totalQuantity = cartItems.reduce((a, c) => a + c.qty, 0);

  return (
    <div className="relative inline-block">
      {totalQuantity > 0 && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 10 
          }}
          className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-indigo-600 
            text-white font-bold px-2.5 py-1 rounded-full text-xs shadow-lg 
            animate-pulse hover:animate-none"
        >
          {totalQuantity}
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
        className="h-7 w-7 text-gray-300 hover:text-blue-500 
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
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </motion.svg>
    </div>
  );
};

export default CartCount;