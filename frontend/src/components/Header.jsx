import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import SmallProduct from "../pages/Products/SmallProduct";
import ProductCarousel from "../pages/Products/ProductCarousel";

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) return <Loader />;
  if (error)
    return (
      <h1 className="text-red-500 text-xl text-center">
        Error loading products
      </h1>
    );

  return (
    <div className="w-full overflow-hidden">
      <div className="flex flex-col-reverse lg:flex-row items-center justify-around gap-20 lg:gap-10 ">
        <div className="w-1/3 ml-20 font-semibold text-2xl">
          <p>
            At Zithara, we believe jewelry is more than just an accessory it's a
            story, a statement, and a celebration of your unique style. Our
            collections are crafted with passion, precision, and a touch of
            magic to help you shine with confidence.
          </p>
        </div>
        <motion.div
          className="w-3/4 relative left-28 lg:w-1/2 "
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="rounded-xl ml-12 mt-28 shadow overflow-hidden w-[25rem] min-h-100%">
            <ProductCarousel />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Header;
