import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useGetProductsByCategoryQuery,
} from "../redux/api/productApiSlice";
import { Store, Clock, Package2, ShoppingCart, ArrowLeft, Star } from "lucide-react";
import moment from "moment";
import HeartIcon from "../pages/Products/HeartIcon";
import ProductLoader from "../components/ProductLoader";
import { addToCart } from "../redux/features/cart/cartSlice";
import back7 from "../assets/back7.mp4";

const SIZES = ["XS", "S", "M", "L", "XL"];
const COLORS = ["Black", "White", "Red", "Blue", "Green"];

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMount, setIsMount] = useState(false);

  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);

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
    setIsMount(true);
    if (product) {
      setSelectedSize(product.size || SIZES[0]);
      setSelectedColor(product.color || COLORS[0]);
    }
  }, [product]);

  useEffect(() => {
    refetch();
  }, [productId, refetch]);

  const addToCartHandler = () => {
    dispatch(addToCart({ 
      ...product, 
      qty: Number(qty), 
      size: selectedSize, 
      color: selectedColor 
    }));
    toast.success("Added to cart successfully!");
    navigate("/cart");
  };

  return (
    <div className="relative min-h-screen font-mono">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover"
      >
        <source src={back7} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <Link 
          to="/shop"
          className="inline-flex items-center text-white/70 hover:text-white mb-8 
            group border border-white/10 px-4 py-2 rounded-lg bg-white/5 
            backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
        >
          <ArrowLeft className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
          Back to Shop
        </Link>

        {isLoading ? (
          <ProductLoader />
        ) : error ? (
          <div className="text-red-400 bg-red-400/10 p-4 rounded-lg backdrop-blur-sm">
            {error?.data?.message || error.message}
          </div>
        ) : (
          <div className={`transition-all duration-700 ${isMount ? "opacity-100" : "opacity-0"}`}>
            {/* Product Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Product Image */}
              <div className="relative group">
                <div className="relative overflow-hidden rounded-2xl border border-white/10 
                  backdrop-blur-sm bg-white/5">
                  <div className={`aspect-square transition-opacity duration-300 
                    ${imageLoaded ? 'opacity-0' : 'opacity-100'}`}>
                    <ProductLoader />
                  </div>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    onLoad={() => setImageLoaded(true)}
                    className={`absolute top-0 left-0 w-full h-full object-cover 
                      transition-all duration-700 group-hover:scale-110 
                      ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  />
                  <div className="absolute top-4 right-4 z-10">
                    <HeartIcon product={product} />
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-8 backdrop-blur-sm bg-white/5 p-6 rounded-2xl 
                border border-white/10">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-4">{product.name}</h1>
                  <p className="text-white/70 leading-relaxed">{product.description}</p>
                </div>

                <div className="text-4xl font-bold text-white">${product.price}</div>

                {/* Size Selection */}
                <div>
                  <h3 className="text-white font-semibold mb-3">Size:</h3>
                  <div className="flex flex-wrap gap-3">
                    {SIZES.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg border transition-all duration-300
                          ${selectedSize === size 
                            ? 'border-white text-white bg-white/20' 
                            : 'border-white/20 text-white/60 hover:border-white/40'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
                <div>
                  <h3 className="text-white font-semibold mb-3">Color:</h3>
                  <div className="flex flex-wrap gap-3">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-lg border transition-all duration-300
                          ${selectedColor === color 
                            ? 'border-white text-white bg-white/20' 
                            : 'border-white/20 text-white/60 hover:border-white/40'}`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product Stats */}
                <div className="grid grid-cols-2 gap-6 py-6 border-y border-white/10">
                  <div className="space-y-4">
                    <div className="flex items-center text-white/70">
                      <Store className="mr-3 text-white" />
                      <span>Brand: {product.brand}</span>
                    </div>
                    <div className="flex items-center text-white/70">
                      <Clock className="mr-3 text-white" />
                      <span>Added: {moment(product.createdAt).fromNow()}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center text-white/70">
                      <Package2 className="mr-3 text-white" />
                      <span>In Stock: {product.countInStock}</span>
                    </div>
                    <div className="flex items-center text-white/70">
                      <Star className="mr-3 text-white fill-white" />
                      <span>Rating: {product.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Add to Cart Section */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <select
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    className="w-full sm:w-32 px-4 py-3 rounded-lg bg-white/5 border border-white/20
                      text-white focus:border-white/40 transition-all duration-300"
                  >
                    {[...Array(product.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>{x + 1}</option>
                    ))}
                  </select>

                  <button
                    onClick={addToCartHandler}
                    disabled={product.countInStock === 0}
                    className="w-full sm:flex-1 px-8 py-3 rounded-lg bg-white/10 text-white
                      hover:bg-white/20 transition-all duration-300 border border-white/20
                      disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]
                      flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>

            {/* Related Products */}
            {!relatedProductsLoading && relatedProducts && relatedProducts.length > 1 && (
              <RelatedProducts 
                products={relatedProducts.filter(p => p.category === product.category)}
                currentProductId={productId}
              />
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ProductDetails;