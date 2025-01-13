import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
    return (
        <div className="w-80 p-4 font-mono">
            <div className="relative group">
                {/* Image Container with Hover Effect */}
                <div className="overflow-hidden rounded-lg bg-zinc-900">
                    <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-64 object-cover transition-transform duration-300 
                        group-hover:scale-105"
                    />
                </div>

                {/* Heart Icon */}
                <div className="absolute top-3 right-3 z-10">
                    <HeartIcon product={product} />
                </div>

                {/* Product Details */}
                <Link to={`product/${product._id}`}>
                    <div className="mt-4 space-y-2">
                        <div className="flex justify-between items-start gap-2">
                            <h2 className="text-white text-lg font-medium font-sans tracking-wide 
                                transition-colors duration-300 hover:text-gray-400 hover:cursor-pointer
                                line-clamp-2">
                                {product.name}
                            </h2>
                            <span className="bg-purple-500/10 text-gray-400 px-3 py-1 
                                rounded-full text-sm font-bold font-sans whitespace-nowrap">
                                $ {product.price}
                            </span>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default SmallProduct;