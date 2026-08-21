import { useState, useEffect } from "react";
import { Car, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./Header.css";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { user, initializing, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout(); // gọi API để backend clearCookie, đồng thời useAuth tự set user = null
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
          {["Home", "Collection", "Services", "About", "Contact"].map(
            (item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="header__nav-link"
              >
                {item}
              </a>
            )
          )}
        </nav>

        {/* Auth */}
        <div className="header__auth">
          {initializing ? null : user ? (
            <>
              <div className="header__user">
                <User size={18} />
                <span>{user.name}</span>
              </div>

              <button className="header__logout" onClick={handleLogout}>
                Đăng xuất
              </button>
            </>
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
