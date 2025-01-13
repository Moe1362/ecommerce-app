import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useGetFilteredProductsQuery } from '../redux/api/productApiSlice';
import { useFetchCategoriesQuery } from '../redux/api/categoryApiSlice';
import {
  setCategories,
  setProducts,
  setChecked,
  setRadio,
} from '../redux/features/shop/shopSlice';
import { FaFilter, FaTimes, FaSearch, FaShoppingBag } from 'react-icons/fa';
import Loader from '../components/Loader';
import ProductCard from '../pages/Products/ProductCard';

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector((state) => state.shop);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceFilter, setPriceFilter] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  const categoriesQuery = useFetchCategoriesQuery();
  const filteredProductsQuery = useGetFilteredProductsQuery({ checked, radio });

  const uniqueBrands = filteredProductsQuery.data
    ? [...new Set(filteredProductsQuery.data.map((product) => product.brand))]
        .filter(Boolean)
        .sort()
    : [];

  useEffect(() => {
    if (!categoriesQuery.isLoading && categoriesQuery.data) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!filteredProductsQuery.isLoading && filteredProductsQuery.data) {
      let result = [...filteredProductsQuery.data];

      if (radio.length) {
        result = result.filter((product) => radio.includes(product.brand));
      }

      if (priceFilter) {
        const price = parseFloat(priceFilter);
        result = result.filter((product) => product.price <= price);
      }

      dispatch(setProducts(result));
      setFilteredProducts(result);
    }
  }, [filteredProductsQuery.data, radio, priceFilter, dispatch]);

  const handleCheck = (value, id) => {
    const updatedChecked = value 
      ? [...checked, id]
      : checked.filter(item => item !== id);
    dispatch(setChecked(updatedChecked));
  };

  const handleBrandClick = (brand) => {
    dispatch(setRadio([brand]));
    setIsFilterOpen(false);
  };

  const handleCategoryClick = (categoryId) => {
  dispatch(setChecked([categoryId]));
  if (window.innerWidth < 1024) {
    setIsFilterOpen(false);
  }
};

  const handleReset = () => {
    dispatch(setChecked([]));
    dispatch(setRadio([]));
    setPriceFilter('');
    setIsFilterOpen(false);
  };

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
            bg-gradient-to-br from-gray-500/20 to-gray-700/20 
            "
        />
      ))}
    </>
  );

  return (
    <div className="relative min-h-screen ">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <BackgroundParticles />
        
        {/* Subtle Geometric Pattern */}
        <div className="absolute inset-0 opacity-[0.05] 
          bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] 
          from-gray-900 via-gray-800 to-black"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold 
              bg-gradient-to-r from-gray-300 to-gray-200 
              bg-clip-text text-transparent">
              Our Shop
            </h1>
            <p className="text-gray-300 mt-1">Browse our collection</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="lg:hidden px-4 py-2 
              bg-gray-800/30 border border-gray-700/50 
              rounded-xl text-gray-300
              hover:bg-gray-700/40 hover:border-gray-600/50 
              transition-all duration-300
              flex items-center space-x-2"
          >
            {isFilterOpen ? <FaTimes size={18} /> : <FaFilter size={18} />}
            <span>{isFilterOpen ? 'Close' : 'Filters'}</span>
          </motion.button>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`lg:w-72 ${
              isFilterOpen 
                ? 'fixed inset-0 z-50 lg:relative lg:inset-auto p-4 lg:p-0' 
                : 'hidden lg:block'
            }`}
          >
            <div className="bg-gray-900/80 backdrop-blur-md 
              rounded-2xl border border-gray-800/50 p-6 
              overflow-auto h-full">
              {/* Close button for mobile */}
              <div className="flex justify-between items-center mb-6 lg:hidden">
                <h2 className="text-lg font-medium text-white">Filters</h2>
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  <FaTimes size={20} />
                </motion.button>
              </div>

              {/* Filter Content */}
              <div className="space-y-6">
                {/* Categories */}
<div>
  <h2 className="text-lg font-medium text-white mb-4">Categories</h2>
  <div className="space-y-2">
    {categories?.map((category) => (
      <div key={category._id} className="flex items-center">
        <input
          type="checkbox"
          id={`category-${category._id}`}
          checked={checked.includes(category._id)}
          onChange={(e) => handleCategoryClick(category._id)}
          className="w-4 h-4 rounded border-gray-800 
            text-cyan-500 focus:ring-cyan-500/20"
        />
        <label
          htmlFor={`category-${category._id}`}
          className="ml-3 text-gray-400 
            hover:text-cyan-400 cursor-pointer 
            transition-colors"
        >
          {category.name}
        </label>
      </div>
    ))}
  </div>
</div>

                

                

                {/* Reset Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReset}
                  className="w-full px-4 py-2 
                    bg-gradient-to-r from-gray-700 to-gray-900 
                    text-white rounded-xl 
                    hover:from-gray-800 hover:to-black
                    transition-all"
                >
                  Reset Filters
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Products Grid */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex-1"
          >
            <div className="mb-6">
              <p className="text-gray-200 text-3xl">
                Showing {filteredProducts.length} products
              </p>
            </div>

            {filteredProductsQuery.isLoading ? (
              <div className="flex justify-center py-20">
                <Loader />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts?.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.1 
                    }}
                    className="transition-transform duration-300 hover:scale-[1.02]"
                  >
                    <ProductCard p={product} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      

      {/* Scrollbar Styles */}
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(75, 85, 99, 0.1);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(75, 85, 99, 0.5);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(75, 85, 99, 0.8);
        }
      `}</style>
    </div>
  );
};

export default Shop;