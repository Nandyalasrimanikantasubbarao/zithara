import { Link, useParams } from "react-router";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";
import HomeScee from "../components/sceens/HomeSceen";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Home() {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <>
      <HomeScee />

      <div className="relative bg-pink-200 -top-16">
        {!keyword && <Header />}

        {isLoading ? (
          <Loader />
        ) : isError ? (
          <Message variant="danger">
            {isError?.data.message || isError.error}
          </Message>
        ) : (
          <div className="mt-28 ml-8 px-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12">
              <h1 className="text-4xl font-bold text-pink-500 text-center md:text-left">
                Special Products
              </h1>

              <Link
                to="/shop"
                className="mt-6 md:mt-0 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-full py-2 px-10 transition duration-300 ease-in-out"
              >
                Shop
              </Link>
            </div>

            <Slider {...settings}>
              {data.products.map((product) => (
                <div key={product._id} className="px-2">
                  <Product product={product} />
                </div>
              ))}
            </Slider>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
