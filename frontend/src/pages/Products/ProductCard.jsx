import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AiOutlineShoppingCart, AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";
import { useState, useEffect } from "react";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();
  const [isDarkBackground, setIsDarkBackground] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...p, qty: quantity }));
    toast.success("Product added to cart");
  };

  const incrementQuantity = () => setQuantity(prev => Math.min(prev + 1, 10));
  const decrementQuantity = () => setQuantity(prev => Math.max(prev - 1, 1));

  useEffect(() => {
    const checkBackgroundColor = () => {
      const img = new Image();
      img.src = p?.image;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 1, 1);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        setIsDarkBackground(brightness < 128);
      };
    };

    checkBackgroundColor();
  }, [p?.image]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.3 }
      }}
      className="relative group overflow-hidden 
        rounded-2xl 
        shadow-xl 
        border border-blue-800
        transition-all duration-300
        w-full max-w-xs mx-auto
        bg-transparent"
    >
      {/* Image Container */}
      <div className="relative">
        {/* Heart Icon */}
        <div className="absolute top-4 right-4 z-10">
          <HeartIcon product={p} isDark={!isDarkBackground} />
        </div>

        {/* Product Image */}
        <Link to={`/product/${p._id}`} className="block">
          <motion.div
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.3 }
            }}
            className="aspect-square overflow-hidden"
          >
            <img
              src={p?.image}
              alt={p.name}
              className="w-full h-full object-cover 
                transition-all duration-300"
            />
          </motion.div>
        </Link>
      </div>

      {/* Product Details */}
      <div className="p-4">
        <Link to={`/product/${p._id}`}>
          <h3 className="text-lg font-semibold 
            text-gray-200 
            truncate
            hover:text-blue-600
            transition-colors duration-300
            mb-2">
            {p?.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-bold text-blue-600">
            ${p?.price?.toFixed(2)}
          </span>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-200">Quantity:</span>
          <div className="flex items-center m-2 ">
            <button onClick={decrementQuantity} className="p-1 mr-1 bg-gray-600 rounded-lg">
              <AiOutlineMinus />
            </button>
            <span className="px-4 py-1 bg-gray-600 rounded-lg">{quantity}</span>
            <button onClick={incrementQuantity} className="p-1 ml-1 bg-gray-600 rounded-lg">
              <AiOutlinePlus />
            </button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addToCartHandler}
          className="w-full p-2 
            bg-blue-500 
            text-white
            rounded-full
            hover:bg-blue-600
            transition-all duration-300
            shadow-md
            flex items-center justify-center"
          aria-label="Add to cart"
        >
          <AiOutlineShoppingCart size={20} className="mr-2" />
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;