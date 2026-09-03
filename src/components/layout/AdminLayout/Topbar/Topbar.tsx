import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate
import {
  Bell,
  Search,
  LogOut,
  User as UserIcon,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../../../../hooks/useAuth";
import "./Topbar.css";

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate(); // 2. Khởi tạo navigate

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h3>Bảng Điều Khiển</h3>
        <p className="topbar-subtitle">
          Chào mừng quay lại,{" "}
          <span className="highlight">{user?.name || "Admin"}</span>! 👋
        </p>
      </div>

      <div className="topbar-right">
        <div className="search-bar">
          <Search size={18} />
          <input type="text" placeholder="Tìm kiếm xe, mã đơn, khách hàng..." />
        </div>

        <button className="noti-btn" aria-label="Thông báo">
          <Bell size={20} />
          <span className="noti-badge"></span>
        </button>

        <div className="admin-profile-wrapper" ref={dropdownRef}>
          <div
            className="admin-profile"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <img
              src={`https://ui-avatars.com/api/?name=${
                user?.name || "Admin"
              }&background=d4a574&color=fff&bold=true`}
              alt="Avatar"
            />
            <div className="admin-info">
              <span className="admin-name">{user?.name || "Admin"}</span>
              <span className="admin-role">Quản trị viên</span>
            </div>
            <ChevronDown
              size={16}
              className={`dropdown-icon ${isDropdownOpen ? "open" : ""}`}
            />
          </div>

          {isDropdownOpen && (
            <div className="profile-dropdown">
              <button className="dropdown-item">
                <UserIcon size={16} />
                <span>Hồ sơ cá nhân</span>
              </button>
              <div className="dropdown-divider"></div>
              <button
                className="dropdown-item text-danger"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
