import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";

const OrderItem = ({ item }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
    <img
      src={item.image}
      alt={item.name}
      className="w-20 h-20 object-cover rounded-lg ring-1 ring-white/20"
    />
    <div className="flex-grow space-y-1">
      <Link 
        to={`/product/${item._id}`}
        className="text-white hover:text-emerald-400 transition-colors font-medium"
      >
        {item.name}
      </Link>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-400">
        <div>
          <span className="text-gray-500">Qty:</span> {item.qty}
        </div>
        <div>
          <span className="text-gray-500">Size:</span> {item.size}
        </div>
        <div>
          <span className="text-gray-500">Color:</span> {item.color}
        </div>
        <div>
          <span className="text-gray-500">Price:</span> ${item.price.toFixed(2)}
        </div>
      </div>
    </div>
    <div className="text-lg font-medium text-emerald-400">
      ${(item.qty * item.price).toFixed(2)}
    </div>
  </div>
);

const SummaryCard = ({ title, children }) => (
  <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
    <h2 className="text-xl font-medium text-white mb-4">{title}</h2>
    {children}
  </div>
);

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
    <div className="min-h-screen  text-white">
      <div className="relative">
        {/* Modern gradient background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <ProgressSteps step1 step2 step3 step4 />

          {error && (
            <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
              {error?.data?.message || 'Error placing order'}
            </div>
          )}

          {cart.cartItems.length === 0 ? (
            <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
              Your cart is empty
            </div>
          ) : (
            <div className="mt-8 space-y-8">
              {/* Order Items */}
              <div className="space-y-4">
                <h2 className="text-2xl font-medium">Order Items</h2>
                <div className="space-y-4">
                  {cart.cartItems.map((item, index) => (
                    <OrderItem key={index} item={item} />
                  ))}
                </div>
              </div>

              {/* Summary Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Price Summary */}
                <SummaryCard title="Price Summary">
                  <div className="space-y-3 text-gray-300">
                    <div className="flex justify-between">
                      <span>Items</span>
                      <span>${itemsPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <div className="text-right">
                        <span>${shippingPrice}</span>
                        {Number(itemsPrice) > 100 && (
                          <span className="block text-sm text-emerald-400">Free Shipping</span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (15%)</span>
                      <span>${taxPrice}</span>
                    </div>
                    <div className="pt-3 border-t border-white/10">
                      <div className="flex justify-between text-lg text-white">
                        <span>Total</span>
                        <span>${totalPrice}</span>
                      </div>
                    </div>
                  </div>
                </SummaryCard>

                {/* Shipping Details */}
                <SummaryCard title="Shipping Details">
                  <div className="text-gray-300 space-y-2">
                    <p>{cart.shippingAddress.address}</p>
                    <p>{cart.shippingAddress.city}, {cart.shippingAddress.postalCode}</p>
                    <p>{cart.shippingAddress.country}</p>
                  </div>
                </SummaryCard>

                {/* Payment Method */}
                <SummaryCard title="Payment Method">
                  <p className="text-gray-300">{cart.paymentMethod}</p>
                </SummaryCard>
              </div>

              {/* Place Order Button */}
              <button
                onClick={placeOrderHandler}
                disabled={cart.cartItems.length === 0 || isLoading}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-500 
                  text-white font-medium rounded-xl shadow-lg 
                  disabled:opacity-50 disabled:cursor-not-allowed
                  hover:shadow-emerald-500/20 hover:scale-[1.02]
                  transition-all duration-300 relative group"
              >
                <span className="relative z-10">
                  {isLoading ? 'Processing...' : 'Place Order'}
                </span>
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-600 to-blue-600 
                  opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300" />
              </button>

              {isLoading && <Loader />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;