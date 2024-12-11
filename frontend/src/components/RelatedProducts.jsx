// components/RelatedProducts.jsx
import { Link } from "react-router-dom";
import { Star, Heart } from "lucide-react";
import HeartIcon from "../pages/Products/HeartIcon";

const RelatedProducts = ({ products, currentProductId }) => {
  return (
    <div className="mt-16 backdrop-blur-sm bg-white/5 p-6 rounded-2xl border border-white/10">
      <h2 className="text-2xl font-bold text-white mb-6">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products
          .filter((p) => p._id !== currentProductId)
          .slice(0, 4)
          .map((product, index) => (
            <div
              key={product._id}
              className="group relative"
              style={{
                animationDelay: `${index * 100}ms`,
                opacity: 0,
                animation: `fadeSlideUp 0.5s ease forwards ${index * 0.1}s`
              }}
            >
              <Link to={`/product/${product._id}`}>
                <div className="relative bg-white/5 backdrop-blur-sm rounded-xl 
                  border border-white/10 overflow-hidden transition-all duration-300 
                  hover:-translate-y-1 hover:border-white/20">
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 
                        group-hover:scale-110"
                    />
                    <div className="absolute top-2 right-2">
                      <HeartIcon product={product} />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-semibold mb-2 line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-white">
                        ${product.price}
                      </span>
                      <div className="flex items-center text-white/70">
                        <Star className="w-4 h-4 fill-yellow-500 stroke-yellow-500 mr-1" />
                        <span>{product.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RelatedProducts;