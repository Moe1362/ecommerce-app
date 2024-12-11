import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Product added to cart");
  }

  return (
    <div className="relative group font-mono">
      <div className="relative bg-[#1A1A1A] rounded-xl overflow-hidden transform transition-all duration-500 
        hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10">
        {/* Image Section */}
        <div className="relative overflow-hidden aspect-[4/3]">
          <Link to={`/product/${p._id}`}>
            <img
              className="w-full h-full object-cover transition-transform duration-700 
                group-hover:scale-110"
              src={p?.image}
              alt={p.name}
            />
          </Link>

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 
            group-hover:opacity-100 transition-opacity duration-300" />

          {/* Brand Tag */}
          <span className="absolute bottom-3 right-3 px-3 py-1 bg-black/30 backdrop-blur-sm rounded-full 
            text-white text-sm font-medium tracking-wide transform transition-all duration-300 
            translate-y-10 group-hover:translate-y-0">
            {p?.brand}
          </span>

          {/* Heart Icon */}
          <div className="absolute top-3 right-3 z-20" onClick={(e) => e.stopPropagation()}>
            <HeartIcon product={p} />
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 space-y-4">
          <div className="flex justify-between items-start gap-2">
            <h5 className="text-xl text-white font-medium tracking-wide line-clamp-2 
              group-hover:text-purple-400 transition-colors duration-300">
              {p?.name}
            </h5>
            <p className="text-lg font-bold text-purple-400 whitespace-nowrap">
              {p?.price?.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </p>
          </div>

          <p className="text-[#CFCFCF] line-clamp-2 text-sm">
            {p?.description}
          </p>

          {/* Actions Section */}
          <div className="flex justify-between items-center pt-2">
            <Link
              to={`/product/${p._id}`}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-white 
                bg-purple-500 rounded-lg overflow-hidden group/btn transition-all duration-300
                hover:bg-purple-600"
            >
              {/* Shine Effect */}
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform 
                -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 
                group-hover/btn:animate-shine" />
              
              <span>Read More</span>
              <svg
                className="w-4 h-4 ml-2 transform transition-transform duration-300 
                  group-hover/btn:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>

            <button 
              onClick={() => addToCartHandler(p, 1)}
              className="p-3 rounded-full bg-purple-500/10 text-purple-400 
                hover:bg-purple-500 hover:text-white transform transition-all duration-300
                hover:scale-110 hover:rotate-12"
            >
              <AiOutlineShoppingCart size={20} />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shine {
          100% {
            left: 125%;
          }
        }
        
        .animate-shine {
          animation: shine 0.85s ease-in;
        }
      `}</style>
    </div>
  );
};

export default ProductCard;