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
    <div className="mt-8 p-4 bg-slate-800 border-2 border-cyan-500 rounded-xl text-cyan-50 font-bold">
      {error.data.message}
    </div>
  ) : (
    <div className="min-h-screen  
      text-cyan-50 font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Details Section */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl border-2 border-cyan-500 
              overflow-hidden shadow-2xl hover:border-teal-400 transition-all duration-500">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700">
                    <tr>
                      <th className="px-4 py-4 text-left text-cyan-50 font-bold">Image</th>
                      <th className="px-4 py-4 text-left text-cyan-50 font-bold">Product</th>
                      <th className="px-4 py-4 text-center text-cyan-50 font-bold">Quantity</th>
                      <th className="px-4 py-4 text-right text-cyan-50 font-bold">Price</th>
                      <th className="px-4 py-4 text-right text-cyan-50 font-bold">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-slate-700">
                    {order.orderItems.map((item, index) => (
                      <tr key={index} className="group hover:bg-slate-700/50 transition-colors">
                        <td className="p-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg ring-2 ring-cyan-500 
                              group-hover:ring-teal-400 transition-all"
                          />
                        </td>
                        <td className="p-4">
                          <Link 
                            to={`/product/${item.product}`}
                            className="text-cyan-200 font-bold hover:text-teal-300 transition-colors"
                          >
                            {item.name}
                          </Link>
                        </td>
                        <td className="p-4 text-center text-cyan-50 font-bold">{item.qty}</td>
                        <td className="p-4 text-right text-cyan-50 font-bold">
                          ${item.price ? Number(item.price).toFixed(2) : '0.00'}
                        </td>
                        <td className="p-4 text-right text-cyan-50 font-bold">
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
          <div className="space-y-8">
            {/* Shipping Info */}
            <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl border-2 border-cyan-500 
              p-6 hover:border-teal-400 transition-all duration-500">
              <h2 className="text-xl font-bold text-cyan-50 mb-4">Shipping Info</h2>
              <div className="space-y-3 text-cyan-200">
                <p><span className="text-cyan-400">Order ID:</span> {order._id}</p>
                <p><span className="text-cyan-400">Name:</span> {order.user.username}</p>
                <p><span className="text-cyan-400">Email:</span> {order.user.email}</p>
                <p><span className="text-cyan-400">Address:</span> {order.shippingAddress.address}</p>
                <p><span className="text-cyan-400">Payment:</span> {order.paymentMethod}</p>
                {order.isPaid ? (
                  <p className="text-emerald-400">Paid on {order.paidAt}</p>
                ) : (
                  <p className="text-rose-400">Not Paid</p>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl border-2 border-cyan-500 
              p-6 hover:border-teal-400 transition-all duration-500">
              <h2 className="text-xl font-bold text-cyan-50 mb-4">Order Summary</h2>
              <div className="space-y-3 text-cyan-200">
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
                <div className="pt-3 border-t-2 border-slate-700">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>${Number(order.totalPrice).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PayPal Button Section */}
            {!order.isPaid && (
              <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl border-2 border-cyan-500 
                p-6 hover:border-teal-400 transition-all duration-500">
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
                className="w-full py-4 px-6 
                  bg-gradient-to-r from-teal-600 to-cyan-700 
                  text-white font-bold rounded-xl shadow-lg 
                  border-2 border-cyan-500 
                  hover:from-teal-700 hover:to-cyan-800 
                  hover:shadow-cyan-500/30 hover:scale-105 
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