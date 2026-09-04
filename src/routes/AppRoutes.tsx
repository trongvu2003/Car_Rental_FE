import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import CarDetailPage from "../pages/CarDetail/CarDetail";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import BookingPage from "../pages/Booking/BookingPage";
import PaymentPage from "../pages/Payment/PaymentPage";
import BookingDetailPage from "../pages/BookingDetail/BookingDetail";
import PaymentSuccess from "../pages/Payment/PaymentSuccess";
import PaymentFailed from "../pages/Payment/PaymentFailed";
import MyBookings from "../pages/MyBookings/MyBookings";
import BlogDetail from "../pages/BlogsDetail/BlogsDetail";
import MainLayout from "../components/layout/MainLayout/MainLayout";
import AdminLayout from "../components/layout/AdminLayout/AdminLayout";
import DashboardPage from "../pages/Admin/DashBoard/DashboardPage";
import ManageBookings from "../pages/Admin/ManageBookings/Bookingspage";
import BookingsPage from "../pages/Admin/ManageBookings/Bookingspage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/cars/:id" element={<CarDetailPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/booking/:id" element={<BookingPage />} />
        <Route path="/payment/:id" element={<PaymentPage />} />
        <Route path="/bookings/:id" element={<BookingDetailPage />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="bookings" element={<BookingsPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
