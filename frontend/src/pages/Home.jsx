import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Header from "../components/Header";
import Message from "../components/Message";
import HeartIcon from "./Products/HeartIcon";
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { useRef } from 'react';
import Footer from "../components/Footer";

const StyledProduct = ({ product }) => (
  <div className="relative w-full h-full group">
    <img
      src={product.image}
      alt={product.name}
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
    <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-2 sm:p-4">
      <h3 className="text-white font-mono text-sm sm:text-lg truncate">{product.name}</h3>
      <p className="text-purple-400 font-mono font-bold mt-1 text-sm sm:text-base">
        ${product.price}
      </p>
    </div>
  </div>
);

function RotatingStars() {
  const starsRef = useRef();
  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.x += 0.0001;
      starsRef.current.rotation.y += 0.0001;
    }
  });
  return <Stars ref={starsRef} radius={300} depth={50} count={5000} factor={4} saturation={0} fade />;
}

function StarrySky() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
      <Canvas>
        <color attach="background" args={['#0f0f10']} />
        <RotatingStars />
      </Canvas>
    </div>
  );
}

const Home = () => {
  const { keyword } = useParams();
  const { data, isError, isLoading } = useGetProductsQuery({ keyword });

  return (
    <div className="flex flex-col min-h-screen">
      <StarrySky />
      {!keyword && <Header />}
      <div className="flex-grow relative z-10">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-bounce">
              <Loader />
            </div>
          </div>
        ) : isError ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Message variant="danger">
              {isError?.data?.message || isError.error}
            </Message>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative">
              {/* Header Content */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 py-6 sm:py-8 md:py-12">
                <div className="text-center sm:text-left w-full sm:w-auto">
                  <h1 className="text-2xl sm:text-3xl font-mono font-bold text-white mb-2 sm:mb-4">
                    Special Products
                  </h1>
                  <p className="text-green-500 font-mono text-sm sm:text-base md:text-lg">
                    Discover our unique collection
                  </p>
                </div>

                {/* Shop Now Button */}
                <Link
                  to="/shop"
                  className="group relative overflow-hidden px-1 inline-flex items-center justify-center w-full sm:w-auto"
                >
                  <div className="relative px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 bg-purple-500 rounded-lg overflow-hidden">
                    <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-30 group-hover:opacity-100 animate-border transition duration-1000 group-hover:duration-200" />
                    <span className="relative flex items-center justify-center space-x-2 text-white font-mono text-sm sm:text-base md:text-lg font-semibold transition duration-200">
                      <span className="transform group-hover:translate-x-1 text-yellow-100 transition-transform duration-200">
                        Shop Now
                      </span>
                      <svg
                        className="w-4 h-4 transform translate-y-px group-hover:translate-x-1 transition-transform duration-200 text-yellow-100"
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
                    </span>
                  </div>
                </Link>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 pb-16">
                {data.products.map((product, index) => (
                  <div
                    key={product._id}
                    className="group relative w-full flex justify-center animate-bounce-custom"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <div className="relative w-full h-[260px] sm:h-[280px] rounded-lg overflow-hidden">
                      {/* Heart Icon Wrapper */}
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
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
     

      <style jsx global>{`
        @keyframes shine {
          100% {
            left: 125%;
          }
        }

        @keyframes border {
          0%,
          100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(1px);
          }
        }

        .animate-shine {
          animation: shine 0.85s ease-in;
        }

        .animate-border {
          animation: border 4s ease infinite;
        }

        @keyframes bounce-custom {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-bounce-custom {
          animation: bounce-custom 2s ease-in-out infinite;
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.2;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.3);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Home;