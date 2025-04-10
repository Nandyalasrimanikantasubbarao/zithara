import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductsTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  return (
    <>
      <div className="px-8 py-6">
        <Link
          to="/"
          className=" ml-8 text-pink-600 font-semibold hover:underline text-lg"
        >
          ← Go Back
        </Link>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.message}
          </Message>
        ) : (
          <>
            <div className="flex flex-col lg:flex-row gap-10 mt-8">
              <div className="relative w-full lg:w-1/2">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full max-w-lg mx-auto rounded-lg shadow-lg object-cover"
                />
                <div className="absolute top-4 right-4">
                  <HeartIcon product={product} />
                </div>
              </div>

              <div className="w-full lg:w-1/2 flex flex-col gap-4">
                <h2 className="text-3xl font-bold text-gray-800">
                  {product.name}
                </h2>
                <p className="text-gray-600">{product.description}</p>

                <p className="text-4xl font-extrabold text-pink-600">
                  ₹ {product.price.toLocaleString("en-IN")}
                </p>

                <div className="grid grid-cols-2 gap-4 text-gray-700 mt-4">
                  <div>
                    <p className="flex items-center">
                      <FaClock className="mr-2" /> Added:{" "}
                      {moment(product.createAt).fromNow()}
                    </p>
                    <p className="flex items-center">
                      <FaStar className="mr-2" /> Reviews: {product.numReviews}
                    </p>
                  </div>

                  <div>
                    <p className="flex items-center">
                      <FaStar className="mr-2" /> Rating: {product.rating}
                    </p>
                    <p className="flex items-center">
                      <FaBox className="mr-2" /> Stock: {product.countInStock}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-4">
                  {product.countInStock > 0 && (
                    <select
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      className="p-2 rounded-lg border border-gray-300 text-black"
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  )}
                  <button
                    onClick={addToCartHandler}
                    disabled={product.countInStock === 0}
                    className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg shadow transition"
                  >
                    Add to Cart
                  </button>
                </div>

                <div className="mt-8">
                  <Ratings
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                    color="yellow-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-12">
              <ProductTabs
                loadingProductReview={loadingProductReview}
                userInfo={userInfo}
                submitHandler={submitHandler}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
                product={product}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ProductDetails;
