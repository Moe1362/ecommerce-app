import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash, FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";
import back from '../assets/black.jpg';

const EmptyCart = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
    <div className="max-w-md w-full bg-zinc-900/80 backdrop-blur-md rounded-2xl p-8 
      border border-zinc-800 shadow-xl hover:border-emerald-500/30 
      transition-all duration-300">
      <FaShoppingCart className="w-16 h-16 mx-auto mb-6 text-emerald-500/80" />
      <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-4">
        Your cart is empty
      </h2>
      <p className="text-zinc-400 text-center mb-8">
        Discover our amazing products and start shopping
      </p>
      <Link 
        to="/" 
        className="flex items-center justify-center space-x-2 w-full py-3 px-6 
          bg-emerald-500/10 text-emerald-400 rounded-xl 
          transition-all duration-300 hover:bg-emerald-500/20
          hover:scale-[1.02] border border-emerald-500/30"
      >
        <FaArrowLeft className="transition-transform group-hover:-translate-x-1" />
        <span>Browse Products</span>
      </Link>
    </div>
  </div>
);

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const CartItem = ({ item }) => {
    const addToCartHandler = (product, qty) => {
      dispatch(addToCart({ ...product, qty }));
    };

    const removeFromCartHandler = (id) => {
      dispatch(removeFromCart(id));
    };

    return (
      <div 
        className="group p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 
          border-b border-zinc-800 last:border-b-0 hover:bg-white/5 
          transition-all duration-300"
      >
        <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 
          ring-1 ring-zinc-800 group-hover:ring-emerald-500/30 transition-all duration-300">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-300 
              group-hover:scale-105"
          />
        </div>

        <div className="flex-grow text-center sm:text-left">
          <Link
            to={`/product/${item._id}`}
            className="text-lg font-medium text-white hover:text-emerald-400 transition-colors"
          >
            {item.name}
          </Link>
          <p className="text-sm text-zinc-400 mt-1">{item.brand}</p>
          <p className="text-xl font-medium text-emerald-400 mt-2">
            ${item.price.toFixed(2)}
          </p>
        </div>

        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <select
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 
              text-white focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500/30 
              transition-all hover:border-emerald-500/30"
            value={item.qty}
            onChange={(e) => addToCartHandler(item, Number(e.target.value))}
            aria-label="Quantity"
          >
            {[...Array(item.countInStock).keys()].map((x) => (
              <option key={x + 1} value={x + 1} className="bg-zinc-900">
                {x + 1}
              </option>
            ))}
          </select>

          <button
            onClick={() => removeFromCartHandler(item._id)}
            className="p-2 rounded-lg text-zinc-400 hover:text-red-400 
              hover:bg-red-500/10 transition-all"
            aria-label="Remove item"
          >
            <FaTrash className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=shipping");
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: `url(${back})`,
            filter: 'blur(4px)',
            transform: 'scale(1.1)',
          }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cart Items */}
              <div className="lg:w-2/3">
                <div className="bg-zinc-900/50 backdrop-blur-md rounded-2xl 
                  border border-zinc-800 overflow-hidden shadow-xl">
                  <div className="p-6 border-b border-zinc-800">
                    <h1 className="text-2xl font-medium text-white">Shopping Cart</h1>
                    <p className="text-zinc-400 mt-1">
                      {cartItems.reduce((acc, item) => acc + item.qty, 0)} items
                    </p>
                  </div>

                  <div>
                    {cartItems.map((item) => (
                      <CartItem key={item._id} item={item} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:w-1/3">
                <div className="bg-zinc-900/50 backdrop-blur-md rounded-2xl 
                  border border-zinc-800 p-6 sticky top-24 shadow-xl">
                  <h2 className="text-xl font-medium text-white mb-6">Order Summary</h2>

                  <div className="space-y-4">
                    <div className="flex justify-between text-zinc-400">
                      <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                      <span className="text-white">
                        ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                      </span>
                    </div>

                    <div className="pt-4 border-t border-zinc-800">
                      <div className="flex justify-between text-xl">
                        <span className="text-zinc-400">Total</span>
                        <span className="text-emerald-400 font-medium">
                          ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={checkoutHandler}
                      className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-sky-500 text-white 
                        py-4 px-6 rounded-xl transition-all duration-300 
                        hover:shadow-lg hover:shadow-emerald-500/20 hover:scale-[1.02]
                        disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Proceed to Checkout
                    </button>

                    <Link 
                      to="/"
                      className="flex items-center justify-center gap-2 text-zinc-400 
                        hover:text-emerald-400 mt-4 transition-colors"
                    >
                      <FaArrowLeft />
                      <span>Continue Shopping</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;