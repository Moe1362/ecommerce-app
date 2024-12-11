import { useState } from "react";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/Loader";
import { FaBoxes } from "react-icons/fa";

const ProductTabs = () => {
  const { data, isLoading } = useGetTopProductsQuery(5);

  if (isLoading) return <Loader />;

  return (
    <div className="mt-16 ml-[10rem]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <FaBoxes className="text-pink-500 text-xl" />
        <h2 className="text-xl font-semibold text-white">Related Products</h2>
      </div>

      {/* Related Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-6">
        {data?.map((product) => (
          <div 
            key={product._id} 
            className="transform transition-all duration-300 hover:scale-[1.02]"
          >
            <SmallProduct product={product} />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {(!data || data.length === 0) && (
        <div className="text-center py-8 bg-gray-800/50 rounded-xl">
          <FaBoxes className="text-4xl text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No related products found</p>
        </div>
      )}
    </div>
  );
};

export default ProductTabs;