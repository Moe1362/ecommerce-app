import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Header from "../components/Header";
import Message from "../components/Message";
import HeartIcon from "./Products/HeartIcon";
import { motion } from "framer-motion";

const StyledProduct = ({ product }) => (
  <div className="relative w-full h-full group">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    <img
      src={product.image}
      alt={product.name}
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
    />
    <div className="absolute bottom-0 left-0 right-0 z-20 bg-black/60 backdrop-blur-sm p-2 sm:p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
      <h3 className="text-white font-['Inter'] text-sm sm:text-lg md:text-xl truncate">
        {product.name}
      </h3>
      <p className="text-gray-300 font-['Inter'] font-bold mt-1 text-sm sm:text-base md:text-lg">
        ${product.price}
      </p>
    </div>
  </div>
);

const ShopNowButton = () => (
  <Link
    to="/shop"
    className="group relative overflow-hidden px-1 inline-flex items-center justify-center w-full sm:w-auto"
  >
    <div className="relative px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 
      bg-gray-900 
      text-white font-['Inter'] font-bold 
      rounded-xl overflow-hidden 
      transition-all duration-300 
      hover:bg-gray-800 hover:shadow-lg hover:scale-105
      flex items-center space-x-2"
    >
      <span>Shop Now</span>
      <svg
        className="w-5 h-5 transform transition-transform group-hover:translate-x-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 7l5 5m0 0l-5 5m5-5H6"
        />
      </svg>
    </div>
  </Link>
);

const Home = () => {
  const { keyword } = useParams();
  const { data, isError, isLoading } = useGetProductsQuery({ keyword });

  // Background Particle Animation
  const BackgroundParticles = () => (
    <>
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * window.innerWidth, 
            y: Math.random() * window.innerHeight,
            opacity: 0 
          }}
          animate={{ 
            x: [
              Math.random() * window.innerWidth, 
              Math.random() * window.innerWidth
            ],
            y: [
              Math.random() * window.innerHeight, 
              Math.random() * window.innerHeight
            ],
            opacity: [0.1, 0.3, 0.1],
            scale: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut"
          }}
          className="absolute w-16 h-16 rounded-full 
            bg-gradient-to-br from-gray-800/20 to-gray-900/20 
            blur-2xl opacity-20"
        />
      ))}
    </>
  );

  return (
    <div className="relative min-h-screen bg-black">
      

      {/* Animated Background Particles */}
      <div className="absolute inset-0 z-10">
        <BackgroundParticles />
      </div>

      {/* Main Content */}
      <div className="relative z-20 flex flex-col min-h-screen">
        {!keyword && <Header />}
        
        <main className="flex-grow relative px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl w-full">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader />
            </div>
          ) : isError ? (
            <div className="py-8">
              <Message variant="danger">
                {isError?.data?.message || isError.error}
              </Message>
            </div>
          ) : (
            <div className="py-6 sm:py-8 lg:py-12">
              {/* Header Section */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 mb-8 sm:mb-12"
              >
                <div className="text-center sm:text-left w-full sm:w-auto ml-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-['Inter'] font-bold text-white mb-2  sm:mb-4
                    bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent">
                    Special Products
                  </h1>
                  <p className="text-gray-400 font-['Inter'] text-sm sm:text-base lg:text-lg">
                    Discover our unique collection
                  </p>
                </div>
                <ShopNowButton />
              </motion.div>

              {/* Product Grid - Responsive for all screen sizes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                {data.products.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.1 
                    }}
                    className="group relative w-full transition-transform duration-300 hover:-translate-y-2"
                  >
                    <div className="relative w-full h-[260px] sm:h-[280px] lg:h-[300px] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                      {/* Heart Icon */}
                      <div 
                        className="absolute top-3 right-3 z-20"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <HeartIcon product={product} />
                      </div>
                      
                      {/* Product Link */}
                      <Link
                        to={`/product/${product._id}`}
                        className="w-full h-full block"
                      >
                        <StyledProduct product={product} />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');

        body {
          font-family: 'Inter', sans-serif;
          background-color: black;
        }

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.1);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(31, 41, 55, 0.8);
        }
      `}</style>
    </div>
  );
};

export default Home;