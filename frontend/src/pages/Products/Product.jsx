import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  return (
    <div className="w-[18rem] sm:w-[20rem] lg:w-[22rem] m-4 p-3 bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out relative">
      <div className="relative">
        <div className="w-full aspect-[1/1] rounded-xl overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="absolute top-3 right-3 z-10">
          <HeartIcon product={product} />
        </div>
      </div>

      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800 hover:text-pink-600 transition duration-200">
              {product.name}
            </h2>
            <span className="bg-pink-100 text-pink-800 text-sm font-semibold px-3 py-1 rounded-full">
              ₹{product.price}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Product;
