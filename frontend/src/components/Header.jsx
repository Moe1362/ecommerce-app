import React, { useRef } from "react";
import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import SmallProduct from "../pages/Products/SmallProduct";
import ProductCarousel from "../pages/Products/ProductCarousel";

const Header = () => {
  const { data, error, isLoading } = useGetTopProductsQuery();
  const featuredProductsRef = useRef(null);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <div className="scale-150">
          <Loader />
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <h2 className="text-red-400 text-xl font-mono animate-pulse">
          {error}
        </h2>
      </div>
    );

  return (
    <div className="min-h-screen overflow-hidden ">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Animated gradient orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px]  rounded-full filter blur-[100px] animate-float-slow" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px]  rounded-full filter blur-[100px] animate-float-slow-delay" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col">
          {/* Carousel Section */}
          <div className="relative">
            <ProductCarousel />
          </div>

          {/* Featured Products Section */}
          <div className="relative mt-8" ref={featuredProductsRef}>
            {/* Section Title */}
            <div className="flex justify-between items-center py-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-sans tracking-tight">
                Featured Products
              </h2>
            </div>

            {/* Products Grid - Responsive Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 pb-12">
              {data.map((product, index) => (
                <div
                  key={product._id}
                  className="group relative transform transition-all duration-500 hover:scale-[1.02]"
                  style={{
                    transitionDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Card Glow Effect */}
                  <div className="absolute inset-0 bg-gray-900 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Product Card */}
                  <div className="relative rounded-xl overflow-hidden backdrop-blur-sm">
                    <div className="transform transition-all duration-500 hover:translate-y-1">
                      <SmallProduct product={product} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
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

        @keyframes floatGradient {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-10px, -10px) rotate(180deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }

        @keyframes floatGradientDelay {
          0% { transform: translate(0, 0) rotate(180deg); }
          50% { transform: translate(10px, 10px) rotate(360deg); }
          100% { transform: translate(0, 0) rotate(540deg); }
        }

        .animate-float-slow {
          animation: floatGradient 15s ease-in-out infinite;
        }

        .animate-float-slow-delay {
          animation: floatGradientDelay 18s ease-in-out infinite;
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Header;