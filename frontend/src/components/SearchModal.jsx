import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAllProductsQuery } from '../redux/api/productApiSlice';
import { CiSearch } from 'react-icons/ci';
import { AiOutlineClose } from 'react-icons/ai';

const SearchModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();
  const { data: productsData, isLoading } = useAllProductsQuery();

  useEffect(() => {
    if (productsData && searchTerm) {
      const products = Array.isArray(productsData) ? productsData : productsData?.products || [];
      
      try {
        const filtered = products.filter(product =>
          product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product?.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
      } catch (error) {
        console.error('Error filtering products:', error);
        setFilteredProducts([]);
      }
    } else {
      setFilteredProducts([]);
    }
  }, [searchTerm, productsData]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    onClose();
    setSearchTerm('');
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 inset-x-0 z-50 px-4 pt-4 sm:pt-6"
          >
            <div className="max-w-3xl mx-auto">
              <div className="bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl">
                {/* Search Input */}
                <div className="p-4">
                  <div className="relative">
                    <CiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search products..."
                      autoFocus
                      className="w-full bg-gray-800/50 text-gray-100 placeholder-gray-400 
                        pl-12 pr-12 py-4 rounded-xl border border-gray-700/50 
                        focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600
                        transition-all duration-300 text-base"
                    />
                    <button
                      onClick={onClose}
                      className="absolute right-4 top-1/2 -translate-y-1/2 
                        p-1.5 rounded-lg
                        text-gray-400 hover:text-gray-200 hover:bg-gray-800/50
                        transition-all duration-300"
                    >
                      <AiOutlineClose className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Results */}
                {searchTerm && (
                  <div className="px-4 pb-4">
                    <div className="max-h-[60vh] overflow-y-auto">
                      {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                      ) : filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {filteredProducts.map((product) => (
                            <motion.div
                              key={product._id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              onClick={() => handleProductClick(product._id)}
                              className="flex items-center gap-4 p-3 rounded-xl 
                                bg-gray-800/30 hover:bg-gray-800/50 cursor-pointer 
                                border border-gray-700/50 hover:border-gray-600
                                transition-all duration-300 group"
                            >
                              <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-gray-100 font-medium truncate">
                                  {product.name}
                                </h3>
                                <p className="text-gray-400 text-sm truncate">
                                  {product.description}
                                </p>
                                <p className="text-green-400 text-sm mt-1 font-medium">
                                  ${product.price}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="text-5xl mb-4">🔍</div>
                          <h3 className="text-gray-300 text-lg font-medium mb-2">
                            No products found
                          </h3>
                          <p className="text-gray-400">
                            Try adjusting your search term
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {!searchTerm && (
                  <div className="text-center py-12 px-4">
                    <div className="text-5xl mb-4">✨</div>
                    <h3 className="text-gray-300 text-lg font-medium mb-2">
                      Start typing to search
                    </h3>
                    <p className="text-gray-400">
                      Search by product name or description
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;