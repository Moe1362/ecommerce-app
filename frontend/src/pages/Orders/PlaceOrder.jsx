import { useEffect, useMemo } from "react";
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
const dispatch = useDispatch();
const cart = useSelector((state) => state.cart);
const { userInfo } = useSelector((state) => state.auth);

const [createOrder, { isLoading, error }] = useCreateOrderMutation();

const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2);

const { itemsPrice, shippingPrice, taxPrice, totalPrice } = useMemo(() => {
  const itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  const shippingPrice = addDecimals(Number(itemsPrice) > 100 ? 0 : 10);
  const taxPrice = addDecimals(Number((0.15 * itemsPrice).toFixed(2)));
  const totalPrice = addDecimals(
    Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)
  );
  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
}, [cart.cartItems]);

useEffect(() => {
  if (!userInfo) {
    navigate('/login');
  }
  if (!cart.shippingAddress.address) {
    navigate("/shipping");
  } else if (!cart.paymentMethod) {
    navigate("/payment");
  }
}, [cart.shippingAddress.address, cart.paymentMethod, navigate, userInfo]);

const placeOrderHandler = async () => {
  try {
    if (!cart.cartItems || cart.cartItems.length === 0) {
      toast.error('No items in cart');
      return;
    }

    const orderItems = cart.cartItems.map(item => ({
      name: item.name,
      qty: item.qty,
      image: item.image,
      price: Number(item.price),
      product: item.product || item._id,
      size: item.size, 
      color: item.color
    }));

    const res = await createOrder({
      orderItems,
      shippingAddress: cart.shippingAddress,
      paymentMethod: cart.paymentMethod,
      itemsPrice: Number(itemsPrice),
      taxPrice: Number(taxPrice),
      shippingPrice: Number(shippingPrice),
      totalPrice: Number(totalPrice)
    }).unwrap();

    if (res && res._id) {
      dispatch(clearCartItems());
      toast.success('Order placed successfully');
      navigate(`/order/${res._id}`);
    }
  } catch (err) {
    toast.error(err?.data?.message || 'Failed to create order');
  }
};

return (
  <div className="min-h-screen 
    font-mono py-20 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <ProgressSteps step1 step2 step3 step4 />
      
      {error && (
        <div className="mt-8 p-4 bg-violet-200/90 border-2 border-pink-400 rounded-xl text-zinc-950 font-extrabold">
          {error?.data?.message || 'Error placing order'}
        </div>
      )}

      {cart.cartItems.length === 0 ? (
        <div className="mt-8 p-4 bg-violet-200/90 border-2 border-pink-400 rounded-xl text-zinc-950 font-extrabold">
          Your cart is empty
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          {/* Order Items Table */}
          <div className="bg-violet-200/90 backdrop-blur-md rounded-2xl border-2 border-pink-400 
            overflow-hidden shadow-xl hover:border-yellow-300 transition-all duration-500">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-pink-400">
                    <th className="px-4 py-4 text-left text-zinc-950 font-extrabold">Product</th>
                    <th className="px-4 py-4 text-left text-zinc-950 font-extrabold">Quantity</th>
                    <th className="px-4 py-4 text-left text-zinc-950 font-extrabold">Size</th>
                    <th className="px-4 py-4 text-left text-zinc-950 font-extrabold">Color</th>
                    <th className="px-4 py-4 text-left text-zinc-950 font-extrabold">Price</th>
                    <th className="px-4 py-4 text-left text-zinc-950 font-extrabold">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-pink-400">
                  {cart.cartItems.map((item, index) => (
                    <tr key={index} className="group hover:bg-violet-300/50 transition-colors">
                      <td className="p-4 flex items-center space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg ring-2 ring-pink-400 
                            group-hover:ring-yellow-300 transition-all"
                        />
                        <Link 
                          to={`/product/${item.product}`}
                          className="text-zinc-950 font-extrabold hover:text-zinc-800 transition-colors"
                        >
                          {item.name}
                        </Link>
                      </td>
                      <td className="p-4 text-zinc-950 font-extrabold">{item.qty}</td>
                      <td className="p-4 text-zinc-950 font-extrabold">{item.size}</td>
                      <td className="p-4 text-zinc-950 font-extrabold">{item.color}</td>
                      <td className="p-4 text-zinc-950 font-extrabold">${item.price.toFixed(2)}</td>
                      <td className="p-4 text-zinc-950 font-extrabold">${(item.qty * item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Summary */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Price Summary */}
            <div className="bg-violet-200/90 backdrop-blur-md rounded-2xl border-2 border-pink-400 
              p-6 hover:border-yellow-300 transition-all duration-500">
              <h2 className="text-xl font-extrabold text-zinc-950 mb-4">Price Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-zinc-950 font-extrabold">
                  <span>Items:</span>
                  <span>${itemsPrice}</span>
                </div>
                <div className="flex justify-between text-zinc-950 font-extrabold">
                  <span>Shipping:</span>
                  <div className="text-right">
                    <span>${shippingPrice}</span>
                    {Number(itemsPrice) > 100 && (
                      <span className="block text-sm text-zinc-950 font-extrabold">Free Shipping</span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between text-zinc-950 font-extrabold">
                  <span>Tax (15%):</span>
                  <span>${taxPrice}</span>
                </div>
                <div className="pt-3 border-t-2 border-pink-400">
                  <div className="flex justify-between text-lg font-extrabold text-zinc-950">
                    <span>Total:</span>
                    <span>${totalPrice}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Details */}
            <div className="bg-violet-200/90 backdrop-blur-md rounded-2xl border-2 border-pink-400 
              p-6 hover:border-yellow-300 transition-all duration-500">
              <h2 className="text-xl font-extrabold text-zinc-950 mb-4">Shipping Details</h2>
              <div className="text-zinc-950 font-extrabold space-y-2">
                <p>{cart.shippingAddress.address}</p>
                <p>{cart.shippingAddress.city}, {cart.shippingAddress.postalCode}</p>
                <p>{cart.shippingAddress.country}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-violet-200/90 backdrop-blur-md rounded-2xl border-2 border-pink-400 
              p-6 hover:border-yellow-300 transition-all duration-500">
              <h2 className="text-xl font-extrabold text-zinc-950 mb-4">Payment Method</h2>
              <p className="text-zinc-950 font-extrabold">{cart.paymentMethod}</p>
            </div>
          </div>

          {/* Place Order Button */}
          <button
            onClick={placeOrderHandler}
            disabled={cart.cartItems.length === 0 || isLoading}
            className="w-full py-4 px-6 mt-8 bg-gradient-to-r from-purple-900 to-indigo-900 
              text-white font-bold rounded-xl shadow-lg 
              border-2 border-pink-400 hover:border-yellow-300 
              disabled:opacity-50 disabled:cursor-not-allowed
              hover:shadow-pink-300/30 hover:scale-105 
              transition-all duration-300 relative group"
          >
            <span className="relative z-10">
              {isLoading ? 'Processing...' : 'Place Order'}
            </span>
            <div className="absolute inset-0 -z-10 bg-pink-500/20 blur-xl 
              opacity-0 group-hover:opacity-100 transition-all duration-500" />
          </button>

          {isLoading && <Loader />}
        </div>
      )}
    </div>
  </div>
);
};

export default PlaceOrder;