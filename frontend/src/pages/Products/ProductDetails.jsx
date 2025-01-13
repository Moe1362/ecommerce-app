import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetProductDetailsQuery,
  useGetProductsByCategoryQuery,
} from "../../redux/api/productApiSlice";
import { 
  Store, 
  Clock, 
  Package2, 
  ShoppingCart, 
  ArrowLeft, 
  Star, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import ProductLoader from "../../components/ProductLoader";
import SmallProduct from "./SmallProduct";
import { addToCart } from "../../redux/features/cart/cartSlice";

const SIZES = ["XS", "S", "M", "L", "XL"];
const COLORS = ["Black", "White", "Red", "Blue", "Green"];

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [currentImage, setCurrentImage] = useState(0);

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { data: relatedProducts, isLoading: relatedProductsLoading } = 
    useGetProductsByCategoryQuery(product?.category?._id || "", {
      skip: !product?.category?._id,
    });

  useEffect(() => {
    if (product) {
      if (product.category?.name?.toLowerCase() === 't-shirt') {
        setSelectedSize(product.size || SIZES[0]);
        setSelectedColor(product.color || COLORS[0]);
      }
    }
  }, [product]);

  useEffect(() => {
    refetch();
  }, [productId, refetch]);

  const addToCartHandler = () => {
    const cartItem = {
      ...product,
      qty: Number(qty),
    };

    if (product.category?.name?.toLowerCase() === 't-shirt') {
      cartItem.size = selectedSize;
      cartItem.color = selectedColor;
    }

    dispatch(addToCart(cartItem));
    toast.success("Added to cart successfully!");
    navigate("/cart");
  };

  const isClothing = product?.category?.name?.toLowerCase() === 't-shirt';

  // Image gallery navigation
  const nextImage = () => {
    const images = product.images || [product.image];
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    const images = product.images || [product.image];
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  // Image gallery component
  const renderProductImages = () => {
    const images = product.images || [product.image];
    
    return (
      <div className="relative group">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentImage}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative rounded-xl overflow-hidden border border-zinc-800 
              bg-white/5 aspect-square"
          >
            <img 
              src={images[currentImage]} 
              alt={`${product.name} - Image ${currentImage + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4">
              <HeartIcon product={product} />
            </div>

            {/* Image Navigation Buttons */}
            {images.length > 1 && (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 
                    bg-black/40 text-white p-2 rounded-full opacity-0 
                    group-hover:opacity-100 transition-opacity duration-300"
                >
                  <ChevronLeft />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 
                    bg-black/40 text-white p-2 rounded-full opacity-0 
                    group-hover:opacity-100 transition-opacity duration-300"
                >
                  <ChevronRight />
                </motion.button>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Image Thumbnails */}
        {images.length > 1 && (
          <div className="flex space-x-2 mt-4 justify-center">
            {images.map((img, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentImage(index)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 transform transition-all
                  ${currentImage === index 
                    ? 'border-emerald-500' 
                    : 'border-transparent hover:border-zinc-700'}`}
              >
                <img 
                  src={img} 
                  alt={`Thumbnail ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </motion.button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-zinc-950"
    >
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link 
          to="/shop"
          className="inline-flex items-center text-zinc-400 hover:text-emerald-400 mb-8 
            group border border-zinc-800 px-4 py-2 rounded-xl bg-white/5 
            hover:border-emerald-500/30 transition-all duration-300"
        >
          <ArrowLeft className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
          Back to Shop
        </Link>

        {isLoading ? (
          <ProductLoader />
        ) : error ? (
          <div className="text-red-400 bg-red-500/10 p-4 rounded-xl border border-red-500/20">
            {error?.data?.message || error.message}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="relative">
                {renderProductImages()}
              </div>

              {/* Product Info */}
              <div className="bg-zinc-900/50 backdrop-blur-md rounded-xl border border-zinc-800 p-6">
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-3">{product.name}</h1>
                    <p className="text-zinc-400 leading-relaxed">{product.description}</p>
                  </div>

                  <div className="text-3xl font-bold text-emerald-400">${product.price}</div>

                  {/* Conditional Size Selection */}
                  {isClothing && (
                    <div>
                      <h3 className="text-white font-medium mb-3">Size:</h3>
                      <div className="flex flex-wrap gap-3">
                        {SIZES.map((size) => (
                          <motion.button
                            key={size}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setSelectedSize(size)}
                            className={`px-4 py-2 rounded-lg border transition-all duration-300
                              ${selectedSize === size 
                                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' 
                                : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
                          >
                            {size}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Conditional Color Selection */}
                  {isClothing && (
                    <div>
                      <h3 className="text-white font-medium mb-3">Color:</h3>
                      <div className="flex flex-wrap gap-3">
                        {COLORS.map((color) => (
                          <motion.button
                            key={color}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setSelectedColor(color)}
                            className={`px-4 py-2 rounded-lg border transition-all duration-300
                              ${selectedColor === color 
                                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' 
                                : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
                          >
                            {color}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Product Stats */}
                  <div className="grid grid-cols-2 gap-6 py-6 border-y border-zinc-800">
                    <div className="space-y-4">
                      <div className="flex items-center text-zinc-400">
                        <Store className="mr-3 text-emerald-400" />
                        <span>Brand: {product.brand}</span>
                      </div>
                      <div className="flex items-center text-zinc-400">
                        <Clock className="mr-3 text-emerald-400" />
                        <span>Added: {moment(product.createdAt).fromNow()}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center text-zinc-400">
                        <Package2 className="mr-3 text-emerald-400" />
                        <span>In Stock: {product.countInStock}</span>
                      </div>
                      <div className="flex items-center text-zinc-400">
                        <Star className="mr-3 text-emerald-400" />
                        <span>Rating: {product.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Add to Cart Section */}
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <select
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      className="w-full sm:w-32 px-4 py-3 rounded-xl bg-white/5 border border-zinc-800
                        text-white focus:border-emerald-500/30 transition-all duration-300"
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                      ))}
                    </select>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={addToCartHandler}
                      disabled={product.countInStock === 0}
                      className="w-full sm:flex-1 px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 
                        text-white hover:from-emerald-600 hover:to-sky-600 transition-all duration-300
                        disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]
                        flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Products Section */}
            {!relatedProductsLoading && relatedProducts?.length > 1 && (
              <div className="mt-16 pt-8 border-t border-zinc-800">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Related Products</h2>
                    <p className="text-zinc-400">You might also like these</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {relatedProducts
                    .filter(p => p._id !== productId)
                    .slice(0, 4)
                    .map((relatedProduct) => (
                      <motion.div 
                        key={relatedProduct._id} 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative bg-zinc-900/50 backdrop-blur-md rounded-xl 
                          hover:scale-[1.02] transition-all duration-300"
                      >
                        <SmallProduct product={relatedProduct} />
                      </motion.div>
                    ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default ProductDetails;