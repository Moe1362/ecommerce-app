import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash, FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";

const Cart = () => {
 const navigate = useNavigate();
 const dispatch = useDispatch();
 const cart = useSelector((state) => state.cart);
 const { cartItems } = cart;

 const addToCartHandler = (product, qty) => {
   dispatch(addToCart({ ...product, qty }));
 };

 const removeFromCartHandler = (id) => {
   dispatch(removeFromCart(id));
 };

 const checkoutHandler = () => {
   navigate("/login?redirect=shipping");
 };

 const EmptyCart = () => (
   <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 font-mono">
     <div className="max-w-md w-full bg-violet-200/90 backdrop-blur-md rounded-2xl p-8 
       border-2 border-pink-400 shadow-xl hover:border-pink-500 
       hover:shadow-pink-300/30 transition-all duration-500">
       <FaShoppingCart className="w-16 h-16 mx-auto mb-6 text-zinc-950 animate-bounce-slow" />
       <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-950 text-center mb-4">
         Your cart is empty
       </h2>
       <p className="text-zinc-950 font-bold text-center mb-8">
         Discover our amazing products and start shopping
       </p>
       <Link 
         to="/" 
         className="flex items-center justify-center space-x-2 w-full py-3 px-6 
           bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-xl 
           transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30
           hover:scale-105 font-bold border-2 border-pink-400 hover:border-yellow-300"
       >
         <FaArrowLeft className="transition-transform group-hover:-translate-x-1" />
         <span>Browse Products</span>
       </Link>
     </div>
   </div>
 );

 const CartItem = ({ item, index }) => (
   <div 
     className="group p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 
       border-b-2 border-pink-400 last:border-b-0 hover:bg-violet-300/50 
       transition-all duration-500"
     style={{ animationDelay: `${index * 100}ms` }}
   >
     <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 
       ring-2 ring-pink-400 group-hover:ring-yellow-300 transition-all duration-500">
       <img
         src={item.image}
         alt={item.name}
         className="w-full h-full object-cover transform transition-transform duration-500 
           group-hover:scale-105"
       />
     </div>

     <div className="flex-grow text-center sm:text-left">
       <Link
         to={`/product/${item._id}`}
         className="text-lg font-extrabold text-zinc-950 hover:text-zinc-800 transition-colors"
       >
         {item.name}
       </Link>
       <p className="text-sm text-zinc-950 font-bold mt-1">{item.brand}</p>
       <p className="text-xl font-extrabold text-zinc-950 mt-2">
         ${item.price.toFixed(2)}
       </p>
     </div>

     <div className="flex items-center gap-4 mt-4 sm:mt-0">
       <select
         className="bg-purple-900 border-2 border-pink-400 rounded-lg px-3 py-2 
           text-white focus:ring-2 focus:ring-purple-300 focus:border-pink-400 
           transition-all hover:border-yellow-300 font-bold"
         value={item.qty}
         onChange={(e) => addToCartHandler(item, Number(e.target.value))}
         aria-label="Quantity"
       >
         {[...Array(item.countInStock).keys()].map((x) => (
           <option key={x + 1} value={x + 1}>
             {x + 1}
           </option>
         ))}
       </select>

       <button
         onClick={() => removeFromCartHandler(item._id)}
         className="p-2 rounded-lg text-zinc-950 hover:text-red-900 
           hover:bg-red-400/20 transition-all"
         aria-label="Remove item"
       >
         <FaTrash className="w-5 h-5" />
       </button>
     </div>
   </div>
 );

 if (cartItems.length === 0) return <EmptyCart />;

 return (
   <div className="min-h-screen 
     pt-20 pb-12 px-4 font-mono">
     <div className="max-w-7xl mx-auto">
       <div className="flex flex-col lg:flex-row gap-8">
         {/* Cart Items Section */}
         <div className="lg:w-2/3">
           <div className="bg-violet-200/90 backdrop-blur-md rounded-2xl 
             border-2 border-pink-400 overflow-hidden shadow-xl 
             hover:border-yellow-300 hover:shadow-pink-300/30 transition-all duration-500">
             <div className="p-6 border-b-2 border-pink-400">
               <h1 className="text-2xl font-extrabold text-zinc-950">Shopping Cart</h1>
               <p className="text-zinc-950 font-bold mt-1">
                 {cartItems.reduce((acc, item) => acc + item.qty, 0)} items
               </p>
             </div>

             <div className="divide-y-2 divide-pink-400">
               {cartItems.map((item, index) => (
                 <CartItem key={item._id} item={item} index={index} />
               ))}
             </div>
           </div>
         </div>

         {/* Order Summary Section */}
         <div className="lg:w-1/3">
           <div className="bg-violet-200/90 backdrop-blur-md rounded-2xl 
             border-2 border-pink-400 p-6 sticky top-24 shadow-xl 
             hover:border-yellow-300 hover:shadow-pink-300/30 transition-all duration-500">
             <h2 className="text-xl font-extrabold text-zinc-950 mb-6">Order Summary</h2>

             <div className="space-y-4">
               <div className="flex justify-between text-zinc-950 font-bold">
                 <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                 <span>
                   ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                 </span>
               </div>

               <div className="pt-4 border-t-2 border-pink-400">
                 <div className="flex justify-between text-xl font-extrabold text-zinc-950">
                   <span>Total</span>
                   <span>
                     ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                   </span>
                 </div>
               </div>

               <button
                 onClick={checkoutHandler}
                 className="w-full mt-6 bg-gradient-to-r from-purple-900 to-indigo-900 text-white 
                   py-4 px-6 rounded-xl font-bold transition-all duration-300 
                   hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105 border-2 border-pink-400
                   hover:border-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 Proceed to Checkout
               </button>

               <Link 
                 to="/"
                 className="flex items-center justify-center gap-2 text-zinc-950 
                   hover:text-zinc-800 mt-4 transition-colors font-bold"
               >
                 <FaArrowLeft />
                 <span>Continue Shopping</span>
               </Link>
             </div>
           </div>
         </div>
       </div>
     </div>
   </div>
 );
};

export default Cart;