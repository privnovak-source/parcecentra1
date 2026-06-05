import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import MenuPage from "./pages/MenuPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/admin" element={<AdminLoginPage />} />
      <Route path="/admin/orders" element={<AdminOrdersPage />} />
      <Route path="/order/:id" element={<OrderConfirmationPage />} />
    </Routes>
  );
}
