import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  return (
    <div className="max-w-4xl mx-auto px-4 mt-12">
      <ProgressSteps step1 step2 />

      <div className="mt-16 bg-white rounded-2xl shadow-xl p-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Shipping Details
        </h1>

        <form onSubmit={submitHandler}>
          <div className="space-y-6">
            <div>
              <label className="block text-gray-600 mb-1">Address</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Enter address"
                value={address}
                required
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1">City</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Enter city"
                value={city}
                required
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1">Postal Code</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Enter postal code"
                value={postalCode}
                required
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1">Country</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Enter country"
                value={country}
                required
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-2">
                Select Payment Method
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="PayPal"
                  checked={paymentMethod === "PayPal"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="accent-pink-600"
                />
                <span className="text-gray-700">PayPal or Credit Card</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-pink-600 text-white text-lg font-semibold py-3 rounded-full shadow-md hover:bg-pink-700 transition"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Shipping;
