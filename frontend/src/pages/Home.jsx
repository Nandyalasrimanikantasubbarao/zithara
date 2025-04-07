import { Link, useParams } from "react-router";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";

function Home() {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  return (
    <>
      {!keyword && <Header />}

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data.message || isError.error}
        </Message>
      ) : (
        <div className="mt-28 ml-16 px-8">
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

          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {data.products.map((product) => (
              <div key={product._id} className="flex justify-center">
                <Product product={product} />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
