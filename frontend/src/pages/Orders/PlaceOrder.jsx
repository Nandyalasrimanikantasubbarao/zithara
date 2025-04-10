import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  const dispatch = useDispatch();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <>
      <ProgressSteps step1 step2 step3 />

      <div className="container ml-7 my-6">
        {cart.cartItems.length === 0 ? (
          <Message>Your cart is empty</Message>
        ) : (
          <div className="overflow-hidden mb-6">
            <div className="flex justify-center flex-col items-center">
              <h2 className="text-2xl font-semibold mb-4">Order Items</h2>

              <table className="w-[40rem] border-collapse mt-10 shadow-lg rounded-lg overflow-hidden">
                <thead className="bg-gray-200 text-gray-700">
                  <tr>
                    <th className="p-2 text-left">Image</th>
                    <th className="p-2 text-left">Product</th>
                    <th className="p-2 text-left">Quantity</th>
                    <th className="p-2 text-left">Price</th>
                    <th className="p-2 text-left">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {cart.cartItems.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-[1rem] h-16 object-cover rounded-md"
                        />
                      </td>
                      <td className="p-2">
                        <Link
                          to={`/product/${item.product}`}
                          className="text-blue-600 hover:underline"
                        >
                          {item.name}
                        </Link>
                      </td>
                      <td className="p-2">{item.qty}</td>
                      <td className="p-2">INR {item.price.toFixed(2)}</td>
                      <td className="p-2 font-semibold">
                        INR {(item.qty * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="grid w-[70rem] justify-center ml-36 md:grid-cols-3 gap-3 mt-4">
          <div className="md:col-span-1 m-2 p-4 rounded-lg shadow-md bg-white text-sm">
            <h2 className="text-lg font-bold mb-3">Order Summary</h2>
            <ul className="space-y-2">
              <li>
                <span className="font-medium">Items:</span> INR{" "}
                {cart.itemsPrice}
              </li>
              <li>
                <span className="font-medium">Shipping:</span> INR{" "}
                {cart.shippingPrice}
              </li>
              <li>
                <span className="font-medium">Tax:</span> INR {cart.taxPrice}
              </li>
              <li className="text-base font-semibold border-t pt-2">
                Total: INR {cart.totalPrice}
              </li>
            </ul>

            {error && (
              <Message variant="danger" className="mt-3 text-sm">
                {error.data.message}
              </Message>
            )}

            <button
              onClick={placeOrderHandler}
              disabled={cart.cartItems.length === 0}
              className="w-full mt-4 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-1.5 px-3 rounded-full transition text-sm"
            >
              Place Order
            </button>

            {isLoading && <Loader />}
          </div>

          {/* Shipping Info */}
          <div className="md:col-span-1 m-2 p-4 rounded-lg shadow-md bg-white text-sm">
            <h2 className="text-lg font-bold mb-3">Shipping</h2>
            <p>
              <strong>Address:</strong> {cart.shippingAddress.address},{" "}
              {cart.shippingAddress.city} {cart.shippingAddress.postalCode},{" "}
              {cart.shippingAddress.country}
            </p>
          </div>

          {/* Payment Method */}
          <div className="md:col-span-1 m-2 p-4 rounded-lg shadow-md bg-white text-sm">
            <h2 className="text-lg font-bold mb-3">Payment Method</h2>
            <p>
              <strong>Method:</strong> {cart.paymentMethod}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceOrder;
