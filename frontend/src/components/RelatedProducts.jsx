import React from 'react';
import { Link } from 'react-router-dom';
import HeartIcon from '../pages/Products/HeartIcon';

const RelatedProduct = ({ product }) => (
  <div className="group bg-zinc-900/50 backdrop-blur-md rounded-xl border border-zinc-800 
    overflow-hidden hover:border-emerald-500/30 transition-all duration-300">
    {/* Product Image */}
    <div className="relative aspect-square">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover transition-transform duration-300 
          group-hover:scale-105"
      />
      {/* Heart Icon */}
      <div className="absolute top-3 right-3 z-10">
        <HeartIcon product={product} />
      </div>
      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent 
        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>

    {/* Product Info */}
    <div className="p-4">
      <Link 
        to={`/product/${product._id}`}
        className="block group-hover:transform group-hover:-translate-y-1 
          transition-transform duration-300"
      >
        <h3 className="text-lg font-medium text-white mb-1 truncate 
          group-hover:text-emerald-400 transition-colors duration-300">
          {product.name}
        </h3>
        <p className="text-zinc-400 text-sm mb-2">{product.brand}</p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-emerald-400 font-medium">${product.price}</span>
          <span className="text-sm text-zinc-500">Rating: {product.rating}</span>
        </div>
      </Link>
    </div>
  </div>
);

const RelatedProducts = ({ products, currentProductId }) => {
  // Filter out current product and limit to 4 products
  const filteredProducts = products
    .filter(product => product._id !== currentProductId)
    .slice(0, 4);

  if (filteredProducts.length === 0) return null;

  return (
    <div className="mt-16 pt-8 border-t border-zinc-800">
      {/* Section Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Related Products</h2>
          <p className="text-zinc-400">You might also like these</p>
        </div>
        <Link 
          to="/shop" 
          className="px-4 py-2 text-emerald-400 hover:text-emerald-300 
            transition-colors duration-300"
        >
          View All
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <RelatedProduct key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;