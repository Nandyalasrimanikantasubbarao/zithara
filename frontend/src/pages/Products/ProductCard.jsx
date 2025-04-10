import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  return (
    <div className="w-full h-[26rem] bg-[#1A1A1A] rounded-2xl shadow-lg dark:bg-gray-800 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300">
      <section className="relative">
        <Link to={`/product/${p._id}`}>
          {/* Optional badge like brand */}
          {p?.brand && (
            <span className="absolute bottom-3 right-3 bg-pink-100 text-pink-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300 z-10">
              {p?.brand}
            </span>
          )}

          <div className="w-full h-48 overflow-hidden rounded-t-2xl">
            <img
              className="w-full h-full object-cover"
              src={p.image}
              alt={p.name}
            />
          </div>
        </Link>

        <div className="absolute -bottom-[8rem] left-[17rem]  z-10">
          <HeartIcon product={p} />
        </div>
      </section>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="mb-2">
          <div className="flex justify-between items-center mb-1">
            <h5 className="text-md font-semibold text-white truncate">
              {p?.name}
            </h5>
            <p className="text-pink-500 text-sm font-bold">
              {p?.price?.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              })}
            </p>
          </div>
          <p className="text-gray-400 text-sm line-clamp-2">
            {p?.description?.substring(0, 80)}...
          </p>
        </div>

        <div className="flex justify-between items-center mt-4">
          <Link
            to={`/product/${p._id}`}
            className="text-sm bg-pink-700 text-white px-3 py-1.5 rounded-lg hover:bg-pink-800 transition"
          >
            Read More
          </Link>
          <button
            className="bg-gray-700 hover:bg-gray-800 p-2 rounded-full"
            onClick={() => addToCartHandler(p, 1)}
          >
            <AiOutlineShoppingCart size={22} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
