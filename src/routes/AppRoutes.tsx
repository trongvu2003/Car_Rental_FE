import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import CarDetailPage from "../pages/CarDetail/CarDetail";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/cars/:id" element={<CarDetailPage />} />
      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default AppRoutes;
