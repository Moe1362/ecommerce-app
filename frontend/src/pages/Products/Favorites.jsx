import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import HeartIcon from "./HeartIcon";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

const EmptyFavorites = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
    <div className="max-w-md w-full bg-zinc-900/80 backdrop-blur-md rounded-2xl p-8 
      border border-zinc-800 shadow-xl hover:border-emerald-500/30 
      transition-all duration-300">
      <FaShoppingCart className="w-16 h-16 mx-auto mb-6 text-emerald-500/80" />
      <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-4">
        No Favorites Yet
      </h2>
      <p className="text-zinc-400 text-center mb-8">
        Start adding some products to your favorites!
      </p>
      <Link 
        to="/shop" 
        className="flex items-center justify-center space-x-2 w-full py-3 px-6 
          bg-emerald-500/10 text-emerald-400 rounded-xl 
          transition-all duration-300 hover:bg-emerald-500/20
          hover:scale-[1.02] border border-emerald-500/30"
      >
        Explore Products
      </Link>
    </div>
  </div>
);

const ProductCard = ({ product }) => (
  <div className="bg-zinc-900/50 backdrop-blur-md rounded-xl border border-zinc-800 
    overflow-hidden hover:border-emerald-500/30 transition-all duration-300">
    <div className="relative aspect-square">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 
        group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute top-3 right-3 z-10">
        <HeartIcon product={product} />
      </div>
    </div>

    <div className="p-6">
      <Link to={`/product/${product._id}`}>
        <h2 className="text-xl font-medium text-white mb-2 line-clamp-2 hover:text-emerald-400 
          transition-colors duration-300">
          {product.name}
        </h2>
      </Link>
      
      <div className="flex justify-between items-center mt-4">
        <span className="text-2xl font-medium text-emerald-400">
          ${product.price}
        </span>
        <Link
          to={`/product/${product._id}`}
          className="px-4 py-2 rounded-xl bg-white/5 text-white text-sm
            hover:bg-emerald-500/10 hover:text-emerald-400 transition-all duration-300 
            border border-zinc-800 hover:border-emerald-500/30"
        >
          View Details
        </Link>
      </div>
    </div>
  </div>
);

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {favorites.length === 0 ? (
          <EmptyFavorites />
        ) : (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                  Your Favorites
                </h1>
                <p className="mt-2 text-zinc-400">
                  {favorites.length} {favorites.length === 1 ? 'item' : 'items'}
                </p>
              </div>
              
              <Link
                to="/shop"
                className="px-6 py-3 bg-emerald-500/10 text-emerald-400 rounded-xl 
                  transition-all duration-300 hover:bg-emerald-500/20 hover:scale-[1.02] 
                  border border-emerald-500/30"
              >
                Continue Shopping
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Favorites;