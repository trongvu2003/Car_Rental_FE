import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import CarDetailPage from "../pages/CarDetail/CarDetail";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import BookingPage from "../pages/Booking/BookingPage";
import PaymentPage from "../pages/Payment/PaymentPage";
import BookingDetailPage from "../pages/BookingDetail/BookingDetail";
import PaymentSuccess from "../pages/Payment/PaymentSuccess";
import PaymentFailed from "../pages/Payment/PaymentFailed";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/cars/:id" element={<CarDetailPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/booking/:id" element={<BookingPage />} />
      <Route path="/booking/:id" element={<BookingPage />} /> (id = car_id),{" "}
      <Route path="/payment/:id" element={<PaymentPage />} /> (id = booking_id),{" "}
      <Route path="/bookings/:id" element={<BookingDetailPage />} /> (id =
      booking_id).
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/payment-failed" element={<PaymentFailed />} />
    </Routes>
  );
};

export default AppRoutes;
