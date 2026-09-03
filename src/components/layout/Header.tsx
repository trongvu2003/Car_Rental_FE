import { useState, useEffect, useRef } from "react";
import { Car, User, History, LogOut, ChevronDown } from "lucide-react"; // Import thêm icon
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./Header.css";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State quản lý dropdown
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref để bắt sự kiện click ra ngoài
  const navigate = useNavigate();
  const { user, initializing, logout } = useAuth();

  // Xử lý hiệu ứng scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Xử lý click ra ngoài để đóng dropdown
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
    await logout();
    navigate("/");
  };

  return (
    <header className={`header ${scrolled ? "header--scrolled" : ""}`}>
      <div className="header__container">
        {/* Logo */}
        <Link to="/" className="header__logo">
          <Car size={26} color="#C9A84C" />
          <span>
            PRESTIGE<strong>DRIVE</strong>
          </span>
        </Link>

        {/* Nav */}
        <nav className="header__nav">
          {[
            { label: "Trang chủ", href: "#home" },
            { label: "Bộ sưu tập", href: "#collection" },
            { label: "Dịch vụ", href: "#services" },
            { label: "Giới thiệu", href: "#about" },
            { label: "Liên hệ", href: "#contact" },
          ].map((item) => (
            <a key={item.label} href={item.href} className="header__nav-link">
              {item.label}
            </a>
          ))}
        </nav>

        {/* Auth */}
        <div className="header__auth">
          {initializing ? null : user ? (
            // Bọc user info trong một thẻ div có ref
            <div className="header__user-menu" ref={dropdownRef}>
              <div
                className="header__user"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <User size={18} />
                <span>{user.name}</span>
                <ChevronDown
                  size={16}
                  className={`chevron ${isDropdownOpen ? "open" : ""}`}
                />
              </div>

              {isDropdownOpen && (
                <div className="dropdown">
                  <Link
                    to="/my-bookings"
                    className="dropdown__item"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <History size={16} />
                    Lịch sử đặt xe
                  </Link>

                  <button
                    className="dropdown__item dropdown__item--logout"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="header__login">
                Đăng nhập
              </Link>
              <Link to="/register" className="header__register">
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
