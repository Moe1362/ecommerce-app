import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css"
import { Route, RouterProvider, createRoutesFromElements } from "react-router"
import { createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";

// Auth
import Login from "./pages/Auth/Login";

import App from "./App.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} >
      <Route path="/login" element={<Login />} />
    </Route>
  )
)

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </Provider>
);
