import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import {
  setCategories,
  setProducts,
  setChecked,
  setRadio,
} from "../redux/features/shop/shopSlice";
import { FaFilter, FaTimes, FaSearch, FaShoppingBag } from "react-icons/fa";
import Loader from "../components/Loader";
import ProductCard from "../pages/Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector((state) => state.shop);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceFilter, setPriceFilter] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const categoriesQuery = useFetchCategoriesQuery();
  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  const uniqueBrands = filteredProductsQuery.data
    ? [...new Set(filteredProductsQuery.data.map(product => product.brand))]
      .filter(Boolean)
      .sort()
    : [];

  // Handle categories data
  useEffect(() => {
    if (!categoriesQuery.isLoading && categoriesQuery.data) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  // Handle filtering logic
  useEffect(() => {
    if (!filteredProductsQuery.isLoading && filteredProductsQuery.data) {
      let result = [...filteredProductsQuery.data];

      // Apply brand filter
      if (radio.length) {
        result = result.filter(product => radio.includes(product.brand));
      }

      // Apply price filter
      if (priceFilter) {
        const price = parseFloat(priceFilter);
        result = result.filter(product => product.price <= price);
      }

      // Update both redux store and local state
      dispatch(setProducts(result));
      setFilteredProducts(result);
    }
  }, [filteredProductsQuery.data, radio, priceFilter, dispatch]);

  const handleCheck = (value, id) => {
    let updatedChecked = [...checked];
    if (value) {
      updatedChecked.push(id);
    } else {
      updatedChecked = updatedChecked.filter((item) => item !== id);
    }
    dispatch(setChecked(updatedChecked));
  };

  const handleBrandClick = (brand) => {
    dispatch(setRadio([brand]));
    setIsFilterOpen(false);
  };

  const handleReset = () => {
    dispatch(setChecked([]));
    dispatch(setRadio([]));
    setPriceFilter("");
    setIsFilterOpen(false);
  };

  return (
    <div className="relative min-h-screen font-mono">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="relative z-10 container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <FaShoppingBag className="text-violet-200/90 text-2xl animate-bounce-slow" />
            <h1 className="text-3xl font-extrabold text-violet-200/90">
              Our Shop
            </h1>
          </div>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="lg:hidden px-4 py-2 bg-violet-200/90 backdrop-blur-md text-zinc-950 rounded-xl 
              flex items-center space-x-2 hover:bg-violet-300/90 border-2 border-pink-400 
              hover:border-yellow-300 font-extrabold transition-all duration-300 transform hover:scale-105"
          >
            {isFilterOpen ? <FaTimes size={18} /> : <FaFilter size={18} />}
            <span>{isFilterOpen ? "Close" : "Filters"}</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Panel */}
          <div 
            className={`lg:w-[300px] ${
              isFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            } transition-all duration-500 fixed lg:relative top-0 left-0 h-full 
            lg:h-auto z-50 lg:z-0`}
          >
            <div className="h-full lg:h-auto bg-violet-200/90 backdrop-blur-xl p-6 rounded-2xl 
              border-2 border-pink-400 hover:border-yellow-300 transition-all duration-300
              overflow-y-auto shadow-xl">
              {/* Filter Sections */}
              <div className="space-y-8">
                {/* Categories */}
                <div>
                  <h2 className="text-xl font-extrabold text-zinc-950 mb-4">Categories</h2>
                  <div className="space-y-2">
                    {categories?.map((c) => (
                      <div 
                        key={c._id}
                        className="group flex items-center p-2 rounded-lg hover:bg-violet-300/50 
                          transition-all duration-300 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          id={`category-${c._id}`}
                          checked={checked.includes(c._id)}
                          onChange={(e) => handleCheck(e.target.checked, c._id)}
                          className="w-4 h-4 accent-pink-400 cursor-pointer"
                        />
                        <label
                          htmlFor={`category-${c._id}`}
                          className="ml-3 text-zinc-950 font-bold cursor-pointer group-hover:text-zinc-900 
                            transition-colors duration-300"
                        >
                          {c.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div>
                  <h2 className="text-xl font-extrabold text-zinc-950 mb-4">Brands</h2>
                  <div className="space-y-2">
                    {uniqueBrands?.map((brand) => (
                      <div 
                        key={brand}
                        className="group flex items-center p-2 rounded-lg hover:bg-violet-300/50 
                          transition-all duration-300 cursor-pointer"
                      >
                        <input
                          type="radio"
                          id={`brand-${brand}`}
                          name="brand"
                          checked={radio.includes(brand)}
                          onChange={() => handleBrandClick(brand)}
                          className="w-4 h-4 accent-pink-400 cursor-pointer"
                        />
                        <label
                          htmlFor={`brand-${brand}`}
                          className="ml-3 text-zinc-950 font-bold cursor-pointer group-hover:text-zinc-900 
                            transition-colors duration-300"
                        >
                          {brand}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div>
                  <h2 className="text-xl font-extrabold text-zinc-950 mb-4">Max Price</h2>
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-950/50" />
                    <input
                      type="number"
                      placeholder="Enter maximum price..."
                      value={priceFilter}
                      onChange={(e) => setPriceFilter(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-violet-300/50 border-2 border-pink-400 
                        rounded-lg text-zinc-950 font-bold placeholder-zinc-900/50 outline-none 
                        focus:border-yellow-300 hover:border-yellow-300
                        transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Reset Button */}
                <button
                  onClick={handleReset}
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-900 to-indigo-900 
                    text-white font-bold rounded-xl shadow-lg border-2 border-pink-400 
                    hover:border-yellow-300 hover:shadow-pink-300/30 hover:scale-105 
                    transition-all duration-300"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-violet-200/90 hidden lg:block">
                {filteredProducts?.length} Products Available
              </h2>
            </div>
            
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6
                transform transition-all duration-700"
            >
              {filteredProducts.length === 0 ? (
                <div className="col-span-full flex justify-center py-20">
                  <Loader />
                </div>
              ) : (
                filteredProducts?.map((p, index) => (
                  <div
                    key={p._id}
                    className="transform transition-all duration-500 hover:scale-105"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      opacity: 0,
                      animation: `fadeSlideUp 0.5s ease forwards ${index * 0.1}s`
                    }}
                  >
                    <ProductCard p={p} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isFilterOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsFilterOpen(false)}
        />
      )}

      <style jsx>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Shop;