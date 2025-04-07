import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  return (
    <div className="container mx-auto px-4 mt-28">
      <h2 className="text-3xl font-bold text-pink-500 mb-6 text-center">
        My Orders
      </h2>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.error || error.error}</Message>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-900 text-white rounded-lg overflow-hidden">
            <thead className="bg-pink-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Image</th>
                <th className="py-3 px-4 text-left">Order ID</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Total</th>
                <th className="py-3 px-4 text-left">Paid</th>
                <th className="py-3 px-4 text-left">Delivered</th>
                <th className="py-3 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-gray-700 hover:bg-gray-800 transition"
                >
                  <td className="py-3 px-4">
                    <img
                      src={order.orderItems[0].image}
                      alt={order.user}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </td>
                  <td className="py-3 px-4">{order._id}</td>
                  <td className="py-3 px-4">
                    {order.createdAt.substring(0, 10)}
                  </td>
                  <td className="py-3 px-4">${order.totalPrice}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        order.isPaid
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {order.isPaid ? "Paid" : "Pending"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        order.isDelivered
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {order.isDelivered ? "Delivered" : "Pending"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Link to={`/order/${order._id}`}>
                      <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-300">
                        View
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserOrder;
