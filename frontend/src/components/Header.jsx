import React, { useRef, useEffect } from "react";
import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import SmallProduct from "../pages/Products/SmallProduct";
import ProductCarousel from "../pages/Products/ProductCarousel";
import * as THREE from "three";

const Header = () => {
  const { data, error, isLoading } = useGetTopProductsQuery();
  const canvasRef = useRef(null);
  const featuredProductsRef = useRef(null);

  useEffect(() => {
    if (isLoading) return;
    if (error) return;

    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Create a starry sky
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 3000;
    const starPositions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 100;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }

    starGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(starPositions, 3)
    );

    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      transparent: true,
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Animate the starry sky
    const animate = () => {
      requestAnimationFrame(animate);
      stars.rotation.x += 0.0005;
      stars.rotation.y += 0.0005;
      renderer.render(scene, camera);
    };

    animate();

    // Scrolling effect for featured products
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
          } else {
            entry.target.classList.remove("animate-fade-in");
          }
        });
      },
      { threshold: 0.5 }
    );

    const featuredProducts = featuredProductsRef.current.children;
    Array.from(featuredProducts).forEach((product) => {
      observer.observe(product);
    });

    return () => {
      renderer.dispose();
      observer.disconnect();
    };
  }, [isLoading, error]);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f10]">
        <div className="scale-150">
          <Loader />
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f10]">
        <h2 className="text-red-400 text-xl font-mono animate-pulse">
          {error}
        </h2>
      </div>
    );

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
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
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight">
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
                  <div className="absolute inset-0 bg-purple-500/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

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

      {/* Custom Scrollbar Styles */}
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
          0% { transform: translate(0, 0); }
          50% { transform: translate(-10px, -10px); }
          100% { transform: translate(0, 0); }
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