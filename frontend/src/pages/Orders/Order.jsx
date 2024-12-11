import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";

const Order = () => {
  const { id: orderId } = useParams();
  const {
    data: order,
    refetch,
    error,
    isLoading,
  } = useGetOrderDetailsQuery(orderId);
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPaypal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  const calculateItemsTotal = (items) => {
    return items.reduce((acc, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.qty) || 0;
      return acc + (price * qty);
    }, 0);
  };

  useEffect(() => {
    if (!errorPayPal && !loadingPaypal && paypal.clientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPaypalScript();
        }
      }
    }
  }, [paypal, order, errorPayPal, loadingPaypal, paypalDispatch]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Payment successful");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    });
  }

  function onError(err) {
    toast.error(err);
  }

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("Order delivered");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: order.totalPrice,
            },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  return isLoading ? (
    <Loader />
  ) : error ? (
    <div className="mt-8 p-4 bg-violet-200/90 border-2 border-pink-400 rounded-xl text-zinc-950 font-extrabold">
      {error.data.message}
    </div>
  ) : (
    <div className="min-h-screen 
      font-mono py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Order Details Section */}
          <div className="lg:w-2/3">
            <div className="bg-violet-200/90 backdrop-blur-md rounded-2xl border-2 border-pink-400 
              overflow-hidden shadow-xl hover:border-yellow-300 transition-all duration-500">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-pink-400">
                      <th className="px-4 py-4 text-left text-zinc-950 font-extrabold">Image</th>
                      <th className="px-4 py-4 text-left text-zinc-950 font-extrabold">Product</th>
                      <th className="px-4 py-4 text-center text-zinc-950 font-extrabold">Quantity</th>
                      <th className="px-4 py-4 text-right text-zinc-950 font-extrabold">Price</th>
                      <th className="px-4 py-4 text-right text-zinc-950 font-extrabold">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-pink-400">
                    {order.orderItems.map((item, index) => (
                      <tr key={index} className="group hover:bg-violet-300/50 transition-colors">
                        <td className="p-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg ring-2 ring-pink-400 
                              group-hover:ring-yellow-300 transition-all"
                          />
                        </td>
                        <td className="p-4">
                          <Link 
                            to={`/product/${item.product}`}
                            className="text-zinc-950 font-extrabold hover:text-zinc-800 transition-colors"
                          >
                            {item.name}
                          </Link>
                        </td>
                        <td className="p-4 text-center text-zinc-950 font-extrabold">{item.qty}</td>
                        <td className="p-4 text-right text-zinc-950 font-extrabold">
                          ${item.price ? Number(item.price).toFixed(2) : '0.00'}
                        </td>
                        <td className="p-4 text-right text-zinc-950 font-extrabold">
                          ${item.price ? (Number(item.price) * Number(item.qty)).toFixed(2) : '0.00'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="lg:w-1/3 space-y-8">
            {/* Shipping Info */}
            <div className="bg-violet-200/90 backdrop-blur-md rounded-2xl border-2 border-pink-400 
              p-6 hover:border-yellow-300 transition-all duration-500">
              <h2 className="text-xl font-extrabold text-zinc-950 mb-4">Shipping Info</h2>
              <div className="space-y-3 text-zinc-950 font-extrabold">
                <p><span className="text-zinc-800">Order ID:</span> {order._id}</p>
                <p><span className="text-zinc-800">Name:</span> {order.user.username}</p>
                <p><span className="text-zinc-800">Email:</span> {order.user.email}</p>
                <p><span className="text-zinc-800">Address:</span> {order.shippingAddress.address}</p>
                <p><span className="text-zinc-800">Payment:</span> {order.paymentMethod}</p>
                {order.isPaid ? (
                  <p className="text-emerald-800">Paid on {order.paidAt}</p>
                ) : (
                  <p className="text-red-800">Not Paid</p>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-violet-200/90 backdrop-blur-md rounded-2xl border-2 border-pink-400 
              p-6 hover:border-yellow-300 transition-all duration-500">
              <h2 className="text-xl font-extrabold text-zinc-950 mb-4">Order Summary</h2>
              <div className="space-y-3 text-zinc-950 font-extrabold">
                <div className="flex justify-between">
                  <span>Items:</span>
                  <span>${calculateItemsTotal(order.orderItems).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>${Number(order.shippingPrice).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${Number(order.taxPrice).toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t-2 border-pink-400">
                  <div className="flex justify-between text-lg">
                    <span>Total:</span>
                    <span>${Number(order.totalPrice).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PayPal Button Section */}
            {!order.isPaid && (
              <div className="bg-violet-200/90 backdrop-blur-md rounded-2xl border-2 border-pink-400 
                p-6 hover:border-yellow-300 transition-all duration-500">
                {loadingPay || isPending ? (
                  <Loader />
                ) : (
                  <PayPalButtons
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                  />
                )}
              </div>
            )}

            {/* Admin Deliver Button */}
            {loadingDeliver && <Loader />}
            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
              <button
                onClick={deliverHandler}
                className="w-full py-4 px-6 bg-gradient-to-r from-purple-900 to-indigo-900 
                  text-white font-bold rounded-xl shadow-lg 
                  border-2 border-pink-400 hover:border-yellow-300 
                  hover:shadow-pink-300/30 hover:scale-105 
                  transition-all duration-300"
              >
                Mark As Delivered
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;