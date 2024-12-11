import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import AdminMenu from "../../pages/Admin/AdminMenu";

const OrderList = () => {
  const { data: orders, error, isLoading } = useGetOrdersQuery();

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="container mx-auto px-4">
          <AdminMenu />
          <div className="bg-gray-800 rounded-xl shadow-xl mt-8 overflow-hidden border border-gray-700">
            <table className="w-full">
              <thead className="bg-gray-700 border-b border-gray-600">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">ITEMS</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">USER</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">DATE</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">TOTAL</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">PAID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">SHIPPED</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {orders?.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4">
                      <img
                        src={order.orderItems[0].image}
                        alt={order._id}
                        className="w-20 h-20 object-cover rounded-lg shadow-md border border-gray-600"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      <span className="font-mono">{order._id}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200 font-medium">
                      {order.user ? order.user.username : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {order.createdAt ? order.createdAt.substring(0, 10) : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-200">
                      ${order.totalPrice}
                    </td>
                    <td className="px-6 py-4">
                      {order.isPaid ? (
                        <span className="px-3 py-1 text-xs font-medium text-green-300 bg-green-900 rounded-full border border-green-700">
                          Completed
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-xs font-medium text-red-300 bg-red-900 rounded-full border border-red-700">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {order.isDelivered ? (
                        <span className="px-3 py-1 text-xs font-medium text-green-300 bg-green-900 rounded-full border border-green-700">
                          Shipped
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-xs font-medium text-red-300 bg-red-900 rounded-full border border-red-700">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Link to={`/order/${order._id}`}>
                        <button className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors border border-blue-500">
                          Details
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;