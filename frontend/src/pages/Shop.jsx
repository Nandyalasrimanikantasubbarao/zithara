import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!filteredProductsQuery.isLoading) {
      let filteredProducts = filteredProductsQuery.data;
      if (priceFilter) {
        filteredProducts = filteredProducts.filter(
          (product) =>
            product.price.toString().includes(priceFilter) ||
            product.price === parseInt(priceFilter, 10)
        );
      }
      dispatch(setProducts(filteredProducts));
    }
  }, [filteredProductsQuery.data, dispatch, priceFilter]);

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };

  return (
    <div className="container mx-auto overflow-hidden h-[900px] flex">
      {/* Categories Sidebar - Fixed */}
      <div className="bg-[#151515] ml-10 p-3 mt-2 mb-2 w-[15rem] flex-shrink-0 overflow-hidden">
        <h2 className="h4 text-center py-2 text-white bg-black rounded-full mb-2">
          Filter by Categories
        </h2>
        <div className="p-5">
          {categories?.map((c) => (
            <div key={c._id} className="mb-2">
              <div className="flex items-center mr-4">
                <input
                  type="checkbox"
                  id={`checkbox-${c._id}`}
                  onChange={(e) => handleCheck(e.target.checked, c._id)}
                  className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor={`checkbox-${c._id}`}
                  className="ml-2 text-sm font-medium text-white dark:text-gray-300"
                >
                  {c.name}
                </label>
              </div>
            </div>
          ))}
        </div>

        <h2 className="h4 text-center py-2 text-white bg-black rounded-full mb-2">
          Filter by Price
        </h2>
        <div className="p-5">
          <input
            type="text"
            placeholder="Enter Price"
            value={priceFilter}
            onChange={handlePriceChange}
            className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-pink-300"
          />
        </div>

        <div className="p-5 pt-0">
          <button
            className="w-full border my-4 text-white py-2 rounded-lg hover:bg-gray-700"
            onClick={() => window.location.reload()}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Products Section - Scrollable */}
      <div className="flex-1 p-3 overflow-y-auto h-screen">
        <h2 className="h4 text-center mb-2">{products?.length} Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
          {products.length === 0 ? (
            <Loader />
          ) : (
            products?.map((p) => (
              <div key={p._id}>
                <ProductCard p={p} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
