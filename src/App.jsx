import { Routes, Route, Navigate } from "react-router-dom";
import Welcome from "./pages/customer/Welcome";
import Menu from "./pages/customer/Menu";
import Cart from "./pages/customer/Cart";
import Success from "./pages/customer/Success";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import PrintQR from "./pages/admin/PrintQR";
import OrderDetail from "./pages/admin/OrderDetail";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/keranjang" element={<Cart />} />
      <Route path="/sukses" element={<Success />} />
      <Route path="/admin/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/pesanan/:id"
        element={
          <ProtectedRoute>
            <OrderDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/qr"
        element={
          <ProtectedRoute>
            <PrintQR />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
