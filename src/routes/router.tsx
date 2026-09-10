import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../components/layout/RootLayout";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import AdminLayout from "../components/layout/AdminLayout";

// Public pages
import Home from "../pages/public/Home";
import ProductDetail from "../pages/public/ProductDetail";
import CategoryPage from "../pages/public/CategoryPage";
import Cart from "../pages/public/Cart";
import Checkout from "../pages/public/Checkout";
import OrderSuccess from "../pages/public/OrderSuccess";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";

// User private pages
import Profile from "../pages/user/Profile";
import OrderHistory from "../pages/user/OrderHistory";
import Addresses from "../pages/user/Addresses";

// Admin pages
import Dashboard from "../pages/admin/Dashboard";
import ProductsList from "../pages/admin/ProductsList";
import ProductForm from "../pages/admin/ProductForm";
import CategoriesManage from "../pages/admin/CategoriesManage";
import OrdersManage from "../pages/admin/OrdersManage";
import UsersManage from "../pages/admin/UsersManage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      // Public
      { index: true, element: <Home /> },
      { path: "product/:id", element: <ProductDetail /> },
      { path: "category/:id", element: <CategoryPage /> },
      { path: "cart", element: <Cart /> },
      { path: "checkout", element: <Checkout /> },
      { path: "order-success", element: <OrderSuccess /> },
      // User Authenticated
      {
        element: <PrivateRoute />,
        children: [
          { path: "profile", element: <Profile /> },
          { path: "orders", element: <OrderHistory /> },
          { path: "addresses", element: <Addresses /> },
        ],
      },
    ],
  },
  // Standalone Auth Pages (Google OAuth Only)
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Login />,
  },
  // Admin Portal
  {
    path: "/admin",
    element: <AdminRoute />,
    children: [
      {
        element: <RootLayout />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, element: <Dashboard /> },
              { path: "products", element: <ProductsList /> },
              { path: "products/new", element: <ProductForm /> },
              { path: "products/:id/edit", element: <ProductForm /> },
              { path: "categories", element: <CategoriesManage /> },
              { path: "orders", element: <OrdersManage /> },
              { path: "users", element: <UsersManage /> },
            ],
          },
        ],
      },
    ],
  },
]);
