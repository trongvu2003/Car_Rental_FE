import { useState, useEffect } from "react";
import { Car, Menu } from "lucide-react";
import "./Header.css";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? "header--scrolled" : ""}`}>
      <div className="header__container">
        {/* Logo */}
        <a href="/" className="header__logo">
          <Car size={26} color="#C9A84C" />
          <span>
            PRESTIGE<strong>DRIVE</strong>
          </span>
        </a>

        {/* Nav */}
        <nav className={`header__nav ${menuOpen ? "header__nav--open" : ""}`}>
          {["Home", "Collection", "Services", "About", "Contact"].map(
            (item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="header__nav-link"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </a>
            )
          )}
        </nav>
        <a href="#booking" className="header__cta">
          Book Now
        </a>
        <button
          className={`header__hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
};

export default Header;
