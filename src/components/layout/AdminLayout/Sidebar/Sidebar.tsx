import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CarFront,
  CalendarDays,
  Users,
  FileText,
  Settings,
  Car,
} from "lucide-react";
import "./Sidebar.css";

export default function Sidebar() {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "nav-item active" : "nav-item";

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">
          <Car size={22} strokeWidth={2.5} />
        </div>
        <span className="logo-text">RENTAL ADMIN</span>
      </div>
      <nav className="sidebar-nav">
        <p className="nav-title">QUẢN LÝ CHUNG</p>

        <NavLink to="/admin/dashboard" className={navClass}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/admin/bookings" className={navClass}>
          <CalendarDays size={20} />
          <span>Đơn đặt xe</span>
        </NavLink>

        <NavLink to="/admin/cars" className={navClass}>
          <CarFront size={20} />
          <span>Danh sách xe</span>
        </NavLink>

        <NavLink to="/admin/users" className={navClass}>
          <Users size={20} />
          <span>Khách hàng</span>
        </NavLink>

        <NavLink to="/admin/blogs" className={navClass}>
          <FileText size={20} />
          <span>Bài viết & Tin tức</span>
        </NavLink>

        <p className="nav-title" style={{ marginTop: "16px" }}>
          HỆ THỐNG
        </p>

        <NavLink to="/admin/settings" className={navClass}>
          <Settings size={20} />
          <span>Cài đặt</span>
        </NavLink>
      </nav>
    </aside>
  );
}
