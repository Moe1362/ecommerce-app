import { useEffect } from 'react';
import { Link } from "react-router-dom";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";
import moment from "moment";
import Loader from "../../components/Loader";

const AllProducts = () => {
  const { data, isLoading, isError, error, refetch } = useAllProductsQuery();

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-500 text-xl bg-gray-800 p-4 rounded-lg shadow-lg">
          Error: {error?.data?.message || error.error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mr-[20rem]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <AdminMenu />
          </div>

          <div className="lg:w-3/4">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-8 border-b border-gray-700 pb-6">
                <div>
                  <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
                    Product Management
                  </h1>
                  <p className="text-gray-400 mt-2">
                    Showing all {data.products.length} products
                  </p>
                </div>
                <div className="bg-gray-700/50 px-6 py-3 rounded-xl border border-gray-600">
                  <Link
                    to="/admin/productlist"
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 
                      text-white rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-300"
                  >
                    Add New Product
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto">
                {data.products.map((product) => (
                  <div
                    key={product._id}
                    className="bg-gray-900/50 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 
                    transform hover:scale-[1.02] border border-gray-700/50 flex flex-col h-full"
                  >
                    <div className="relative group">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-40 object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 
                        group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="text-white text-sm font-medium px-4 py-2 bg-pink-500/80 rounded-lg backdrop-blur-sm">
                          View Details
                        </span>
                      </div>
                    </div>

                    <div className="p-4 flex flex-col flex-grow">
                      <div className="flex flex-col gap-2 mb-3">
                        <h2 className="text-lg font-bold text-white hover:text-pink-500 transition-colors duration-200 truncate">
                          {product.name}
                        </h2>
                        <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                          ${product.price}
                        </span>
                      </div>

                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="mt-auto space-y-3">
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-gray-800/80 rounded-lg text-gray-300 text-xs border border-gray-700">
                            Stock: {product.countInStock}
                          </span>
                          <span className="px-2 py-1 bg-gray-800/80 rounded-lg text-gray-300 text-xs border border-gray-700">
                            {product.brand}
                          </span>
                          <span className="px-2 py-1 bg-gray-800/80 rounded-lg text-gray-300 text-xs border border-gray-700">
                            {moment(product.createdAt).format("MMM Do")}
                          </span>
                        </div>

                        <Link
                          to={`/admin/product/update/${product._id}`}
                          className="inline-flex w-full items-center justify-center px-4 py-2 bg-gradient-to-r 
                            from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 
                            transition-all duration-300 text-sm shadow-lg hover:shadow-pink-500/25"
                        >
                          Update Product
                          <svg
                            className="w-4 h-4 ml-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;