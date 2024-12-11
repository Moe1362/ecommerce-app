import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import { FaClock } from "react-icons/fa";

const ProductCarousel = () => {
  const { data: products, error, isLoading } = useGetTopProductsQuery();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    className: "relative",
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
  };

  function CustomNextArrow(props) {
    const { onClick } = props;
    return (
      <button
        onClick={onClick}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-10 bg-black/20 hover:bg-black/40 p-3 
          rounded-full backdrop-blur-sm transition-all duration-300 group border border-white/10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white transition-transform duration-300 group-hover:translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    );
  }

  function CustomPrevArrow(props) {
    const { onClick } = props;
    return (
      <button
        onClick={onClick}
        className="absolute left-10 top-1/2 -translate-y-1/2 z-10 bg-black/20 hover:bg-black/40 p-3 
          rounded-full backdrop-blur-sm transition-all duration-300 group border border-white/10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white transition-transform duration-300 group-hover:-translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
    );
  }

  return (
    <div className="w-full max-w-[90rem] mx-auto mr-[2rem] pt-2">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
      ) : (
        <Slider {...settings}>
          {products?.map(
            ({ image, _id, name, price, description, createdAt }) => (
              <div key={_id} className="relative">
                {/* Image Section */}
                <div className="relative h-[550px] rounded-2xl overflow-hidden">
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-105"
                  />

                  {/* Overlay Content */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-8 pl-24">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column - All Info */}
                        <div className="space-y-4 font-mono">
                          <h2 className="text-4xl font-bold text-white">
                            {name}
                          </h2>
                          <p className="text-2xl text-purple-400 font-bold">
                            $ {price}
                          </p>
                          <p className="text-gray-300 line-clamp-3">
                            {description}
                          </p>
                          <div className="flex items-center text-gray-300 transition-all duration-300 hover:text-purple-400">
                            <FaClock className="mr-2" />
                            <span className="font-medium">Added:</span>
                            <span className="ml-2">
                              {moment(createdAt).fromNow()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;