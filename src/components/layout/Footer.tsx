import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer" id="contact">
      <div className="footer__container">
        <div className="footer__top">
          {/* Brand */}
          <div className="footer__brand">
            <a href="/" className="footer__logo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L14.5 8.5H21L15.5 12.5L17.5 19L12 15L6.5 19L8.5 12.5L3 8.5H9.5L12 2Z"
                  fill="#C9A84C"
                />
              </svg>
              <span>
                PRESTIGE<strong>DRIVE</strong>
              </span>
            </a>
            <p className="footer__tagline">
              Nigeria's premier destination for luxury car rentals. Drive with
              distinction.
            </p>
            <div className="footer__social">
              {["IG", "TW", "FB", "LI"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="footer__social-link"
                  aria-label={s}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="footer__links">
            <div className="footer__col">
              <h4 className="footer__col-title">Company</h4>
              {["About Us", "Our Fleet", "Services", "Careers"].map((l) => (
                <a key={l} href="#" className="footer__link">
                  {l}
                </a>
              ))}
            </div>
            <div className="footer__col">
              <h4 className="footer__col-title">Services</h4>
              {[
                "Wedding Cars",
                "Airport Transfer",
                "Corporate",
                "Event Hire",
              ].map((l) => (
                <a key={l} href="#" className="footer__link">
                  {l}
                </a>
              ))}
            </div>
            <div className="footer__col">
              <h4 className="footer__col-title">Contact</h4>
              <p className="footer__contact-item">📍 Victoria Island, Lagos</p>
              <p className="footer__contact-item">📞 +234 800 PRESTIGE</p>
              <p className="footer__contact-item">✉️ hello@prestigedrive.ng</p>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© 2024 PrestigeDrive Nigeria. All rights reserved.</p>
          <div className="footer__bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
