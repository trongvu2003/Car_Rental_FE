import "./Footer.css";
import { MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="footer" id="footer">
      <div className="footer__container">
        <div className="footer__top">
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
              Điểm đến hàng đầu cho dịch vụ thuê xe siêu sang tại Việt Nam.
              Khẳng định đẳng cấp trên mọi cung đường.
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

          <div className="footer__links">
            <div className="footer__col">
              <h4 className="footer__col-title">Công Ty</h4>
              {["Về Chúng Tôi", "Bộ Sưu Tập Xe", "Dịch Vụ", "Tuyển Dụng"].map(
                (l) => (
                  <a key={l} href="#" className="footer__link">
                    {l}
                  </a>
                )
              )}
            </div>
            <div className="footer__col">
              <h4 className="footer__col-title">Dịch Vụ</h4>
              {[
                "Xe Cưới Hỏi",
                "Đưa Đón Sân Bay",
                "Doanh Nghiệp",
                "Thuê Xe Sự Kiện",
              ].map((l) => (
                <a key={l} href="#" className="footer__link">
                  {l}
                </a>
              ))}
            </div>
            <div className="footer__col">
              <h4 className="footer__col-title">Liên Hệ</h4>
              <p className="footer__contact-item">
                <MapPin size={16} color="#C9A84C" /> Quận 1, TP. Hồ Chí Minh
              </p>
              <p className="footer__contact-item">
                <Phone size={16} color="#C9A84C" /> +84 (0) 90 123 4567
              </p>
              <p className="footer__contact-item">
                <Mail size={16} color="#C9A84C" /> luxury@prestigedrive.vn
              </p>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© 2026 PrestigeDrive Việt Nam. Đã đăng ký bản quyền.</p>
          <div className="footer__bottom-links">
            <a href="#">Chính Sách Bảo Mật</a>
            <a href="#">Điều Khoản Dịch Vụ</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
