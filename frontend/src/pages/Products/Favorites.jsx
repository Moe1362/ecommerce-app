import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import HeartIcon from "./HeartIcon";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";


const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (favorites.length === 0) {
    return (
      <div className="relative min-h-screen font-mono flex items-center justify-center">
        <div className="relative z-10 text-center p-8">
          <div className="backdrop-blur-md bg-black/30 rounded-xl p-8 border border-white/10">
            <div className="text-6xl mb-6">💝</div>
            <h2 className="text-3xl font-bold text-white mb-4">No Favorites Yet</h2>
            <p className="text-white/70 mb-8">Start adding some products to your favorites!</p>
            <Link 
              to="/shop" 
              className="inline-flex items-center px-6 py-3 rounded-lg bg-white/20 text-white
                hover:bg-white/30 transition-all duration-300 border border-white/10"
            >
              Explore Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen font-mono">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        className="fixed top-0 left-0 w-full h-full object-cover"
      >
        <source src={back5} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-8xl mx-auto">
          <h1 className="text-4xl font-bold mb-12 text-white text-center">
            Your Favorite Products
          </h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {favorites.map((product, index) => (
              <div
                key={product._id}
                className="group backdrop-blur-md bg-black/30 rounded-xl border border-white/10 overflow-hidden
                  transform transition-all duration-500 hover:border-white/20"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transform transition-transform duration-700 
                      group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 
                    group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-3 right-3 transform translate-x-2 opacity-0 
                    group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                    <HeartIcon product={product} />
                  </div>
                </div>

                <div className="p-6">
                  <Link 
                    to={`/product/${product._id}`}
                    className="block group-hover:transform group-hover:-translate-y-1 transition-transform duration-300"
                  >
                    <h2 className="text-xl font-bold text-white mb-2 line-clamp-2">
                      {product.name}
                    </h2>
                  </Link>
                  
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-2xl font-bold text-white">
                      $ {product.price}
                    </span>
                    <Link
                      to={`/product/${product._id}`}
                      className="px-4 py-2 rounded-lg bg-white/20 text-white text-sm
                        hover:bg-white/30 transition-all duration-300 border border-white/10"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Favorites;