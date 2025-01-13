import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import { 
  FaClock, 
  FaArrowRight, 
  FaArrowLeft 
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const ProductCarousel = () => {
  const { data: products, error, isLoading } = useGetTopProductsQuery();

  const getImageBrightness = (imageSrc) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = imageSrc;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        let brightness = 0;
        for (let i = 0; i < data.length; i += 4) {
          brightness += (data[i] * 299 + data[i + 1] * 587 + data[i + 2] * 114) / 1000;
        }
        
        brightness /= (data.length / 4);
        resolve(brightness);
      };
      
      img.onerror = reject;
    });
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 5000,
    dotsClass: "slick-dots !bottom-4",
    className: "relative product-carousel",
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    customPaging: (i) => (
      <button 
        className="w-3 h-3 rounded-full bg-white/30 hover:bg-white/70 
        transition-all duration-300"
      />
    )
  };

  function CustomNextArrow(props) {
    const { onClick } = props;
    return (
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ 
          scale: 1.15,
          rotate: 360,
          transition: { duration: 0.5 }
        }}
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 
          bg-transparent hover:bg-white/10 
          p-3 rounded-full 
          transition-all duration-300
          border border-white/20 hover:border-white/30"
      >
        <FaArrowRight className="text-xl text-white hover:text-white" />
      </motion.button>
    );
  }

  function CustomPrevArrow(props) {
    const { onClick } = props;
    return (
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ 
          scale: 1.15,
          rotate: -360,
          transition: { duration: 0.5 }
        }}
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 
          bg-transparent hover:bg-white/10 
          p-3 rounded-full 
          transition-all duration-300
          border border-white/20 hover:border-white/30"
      >
        <FaArrowLeft className="text-xl text-white hover:text-white" />
      </motion.button>
    );
  }

  const ProductSlide = ({ image, _id, name, price, description, createdAt }) => {
    const [textColor, setTextColor] = useState({
      title: 'text-white',
      price: 'text-gray-200',
      description: 'text-gray-300',
      time: 'text-gray-400'
    });

    useEffect(() => {
      const determineTextColor = async () => {
        try {
          const brightness = await getImageBrightness(image);
          
          // Adjust these thresholds as needed
          if (brightness > 180) {
            // Bright image - use dark text
            setTextColor({
              title: 'text-black',
              price: 'text-gray-800',
              description: 'text-gray-700',
              time: 'text-gray-600'
            });
          } else {
            // Dark image - use light text
            setTextColor({
              title: 'text-white',
              price: 'text-gray-200',
              description: 'text-gray-300',
              time: 'text-gray-400'
            });
          }
        } catch (error) {
          console.error("Could not determine image brightness", error);
        }
      };

      determineTextColor();
    }, [image]);

    return (
      <div className="outline-none">
        <div 
          className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] 
            overflow-hidden"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <motion.img
              src={image}
              alt={name}
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 flex items-end h-full p-4 sm:p-6 md:p-12 lg:p-16">
            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 relative">
              {/* Product Details */}
              <div className="space-y-2 sm:space-y-4 self-end text-left">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight ${textColor.title}`}
                >
                  {name}
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className={`text-xl sm:text-2xl font-semibold ${textColor.price}`}
                >
                  ${price.toFixed(2)}
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className={`line-clamp-2 sm:line-clamp-3 
                    text-sm sm:text-base md:text-lg ${textColor.description}`}
                >
                  {description}
                </motion.p>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className={`flex items-center text-xs sm:text-sm 
                    hover:opacity-80 transition-opacity ${textColor.time}`}
                >
                  <FaClock className={`mr-2 ${textColor.time}`} />
                  <span>
                    Added {moment(createdAt).fromNow()}
                  </span>
                </motion.div>
              </div>

              {/* Shop Now Button - Positioned Absolutely */}
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute bottom-0 right-0"
              >
                <Link
                  to={`/product/${_id}`}
                  className={`group relative 
                    ${textColor.title === 'text-white' 
                      ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white' 
                      : 'bg-black/10 hover:bg-black/20 border-black/20 text-black'}
                    font-bold py-2 sm:py-3 px-4 sm:px-8 rounded-xl 
                    transition-all duration-300 
                    flex items-center gap-2 text-sm sm:text-base
                    border hover:border-opacity-50`}
                >
                  <span>Shop Now</span>
                  <motion.div
                    animate={{ 
                      x: [0, 5, 0],
                      transition: { 
                        repeat: Infinity, 
                        duration: 1,
                        ease: "easeInOut"
                      }
                    }}
                  >
                    <FaArrowRight className="text-sm sm:text-base" />
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
      ) : (
        <Slider {...settings}>
          {products?.map((product) => (
            <ProductSlide key={product._id} {...product} />
          ))}
        </Slider>
      )}

      {/* Custom Styles for Slick Dots */}
      <style jsx global>{`
        .product-carousel .slick-dots {
          bottom: 20px !important;
        }
        .product-carousel .slick-dots li {
          margin: 0 4px !important;
        }
        .product-carousel .slick-dots li button {
          width: 12px !important;
          height: 12px !important;
          background: rgba(255,255,255,0.3) !important;
          border-radius: 50% !important;
          transition: all 0.3s ease !important;
        }
        .product-carousel .slick-dots li.slick-active button {
          background: white !important;
          width: 16px !important;
        }
      `}</style>
    </div>
  );
};

export default ProductCarousel;