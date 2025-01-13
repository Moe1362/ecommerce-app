import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { 
  Route, 
  RouterProvider, 
  createRoutesFromElements, 
  useLocation, 
  useNavigate 
} from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";

// Import all your existing routes and components
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import App from "./App.jsx";
import Profile from "./User/Profile";
import AdminRoute from "./pages/Admin/AdminRoute.jsx";
import UserList from "./pages/Admin/UserList.jsx";
import CategoryList from "./pages/Admin/CategoryList.jsx";
import ProductList from "./pages/Admin/ProductList.jsx";
import AllProducts from "./pages/Admin/AllProducts.jsx";
import ProductUpdate from "./pages/Admin/ProductUpdate.jsx";
import Home from "./pages/Home.jsx";
import Favorites from "./pages/Products/Favorites.jsx";
import ProductDetails from "./pages/Products/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Shop from "./pages/Shop.jsx";
import Shipping from "./pages/Orders/Shipping.jsx";
import PlaceOrder from "./pages/Orders/PlaceOrder.jsx";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import Order from "./pages/Orders/Order.jsx";
import UserOrder from "./User/UserOrder.jsx";
import OrderList from "./pages/Admin/OrderList.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";

// Custom hook for scrolling to top
const useScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    try {
      // Use window.scrollTo with smooth behavior
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'  // Changed from 'smooth' for immediate scrolling
      });
    } catch (error) {
      console.error("Scroll to top failed:", error);
    }
  }, [pathname]);
};

// Wrapper component to apply scroll to top
const ScrollToTopWrapper = ({ children }) => {
  useScrollToTop();
  return children;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={
      <ScrollToTopWrapper>
        <App />
      </ScrollToTopWrapper>
    }>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route index={true} path="/" element={<Home />} />
      <Route path="/favorite" element={<Favorites />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/user-orders" element={<UserOrder />} />
      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/placeorder" element={<PlaceOrder />} />
        <Route path="/order/:id" element={<Order />} />
      </Route>
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route path="userlist" element={<UserList />} />
        <Route path="categorylist" element={<CategoryList />} />
        <Route path="productlist" element={<ProductList />} />
        <Route path="allproductslist" element={<AllProducts />} />
        <Route path="product/update/:id" element={<ProductUpdate />} />
        <Route path="orderlist" element={<OrderList />} />
        <Route path="dashboard" element={<AdminDashboard />} />
      </Route>
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PayPalScriptProvider deferLoading={true}>
      <StrictMode>
        <RouterProvider router={router} />
      </StrictMode>
    </PayPalScriptProvider>
  </Provider>
);