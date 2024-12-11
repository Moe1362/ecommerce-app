import { Link } from "react-router-dom";
import HeartIcon from "../../pages/Products/HeartIcon";

const Product = ({ product }) => {
  return (
    <div className="w-[30rem]  p-20 relative">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-[30rem] object-cover rounded"
        />
        <div className="absolute top-2 right-2">
          <HeartIcon product={product} />
        </div>
      </div>
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h2 className="flex justify-between items-center">
            <div className="text-lg">{product.name}</div>
            <span className="bg-pink-100 text-pink-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">$ {product.price}</span>
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default Product;