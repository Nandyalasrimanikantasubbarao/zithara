import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import { FaBox, FaClock, FaShoppingCart, FaStar } from "react-icons/fa";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="mb-4 w-full h-1/2  mx-auto">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Slider {...settings}>
          {products.map(
            ({
              image,
              _id,
              name,
              price,
              description,
              createdAt,
              numReviews,
              rating,
              quantity,
              countInStock,
            }) => (
              <div
                key={_id}
                className="p-4 bg-white rounded-xl shadow-lg flex flex-col items-center"
              >
                {/* Image Container */}
                <div className="w-full h-[350px] overflow-hidden rounded-lg mb-4">
                  <img
                    className="w-full h-full object-cover"
                    src={image}
                    alt={name}
                  />
                </div>

                {/* Product Info */}
                <div className="w-full space-y-2 text-center">
                  <h2 className="text-xl font-semibold">{name}</h2>
                  <p className="text-gray-700 font-medium">INR {price}</p>
                  <p className="text-gray-500 text-sm">
                    {description.substring(0, 150)}...
                  </p>
                </div>

                {/* Meta Info */}
                <div className="grid grid-cols-2 gap-4 mt-6 text-sm w-full">
                  <div className="space-y-2">
                    <p className="flex items-center">
                      <FaClock className="mr-2 text-blue-500" />{" "}
                      {moment(createdAt).fromNow()}
                    </p>
                    <p className="flex items-center">
                      <FaStar className="mr-2 text-yellow-500" /> {numReviews}{" "}
                      reviews
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="flex items-center">
                      <FaStar className="mr-2 text-yellow-500" /> Rating:{" "}
                      {Math.round(rating)}
                    </p>
                    <p className="flex items-center">
                      <FaShoppingCart className="mr-2 text-green-500" /> Qty:{" "}
                      {quantity}
                    </p>
                    <p className="flex items-center">
                      <FaBox className="mr-2 text-purple-500" /> In Stock:{" "}
                      {countInStock}
                    </p>
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
