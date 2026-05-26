import "./AboutSection.css";
import aboutCar from "../../assets/images/about-car.jpg";
const AboutSection = () => {
  return (
    <section className="about" id="about">
      <div className="about__container">
        <div className="about__content">
          <span className="section-tag">VỀ CHÚNG TÔI</span>
          <h2 className="section-title">
            Định Nghĩa Lại Sự <span className="gold">Đẳng Cấp</span>
          </h2>

          <div className="about__text">
            <p>
              PrestigeDrive là dịch vụ cho thuê xe sang trọng hàng đầu, mang đến
              bộ sưu tập những chiếc xe danh giá nhất thế giới. Chúng tôi không
              chỉ đơn thuần cho thuê xe; chúng tôi trao gửi những trải nghiệm
              phi thường.
            </p>
            <p>
              Từ sức mạnh bùng nổ của một chiếc Lamborghini đến sự thanh lịch
              tinh tế của Rolls-Royce, mỗi chiếc xe trong đội xe của chúng tôi
              đều đại diện cho đỉnh cao của sự hoàn mỹ.
            </p>
          </div>

          <ul className="about__list">
            {[
              "Đặc quyền tiếp cận những dòng xe tuyệt mỹ nhất thế giới",
              "Dịch vụ cá nhân hóa theo từng sở thích của bạn",
              "Điều khoản thuê linh hoạt từ theo giờ đến theo tháng",
              "Cung cấp dịch vụ tài xế riêng chuyên nghiệp",
              "Quy trình đặt xe và giao nhận liền mạch",
              "Sự lựa chọn đáng tin cậy của giới tinh hoa từ năm 2018",
            ].map((item, index) => (
              <li key={index} className="about__list-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="rgba(201, 168, 76, 0.1)"
                    stroke="#C9A84C"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M8 12L11 15L16 9"
                    stroke="#C9A84C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="about__stats">
            <div className="stat-item">
              <h4 className="stat-item__number">500+</h4>
              <span className="stat-item__label">Khách Hàng Hài Lòng</span>
            </div>
            <div className="stat-item">
              <h4 className="stat-item__number">20+</h4>
              <span className="stat-item__label">Siêu Xe Đẳng Cấp</span>
            </div>
            <div className="stat-item">
              <h4 className="stat-item__number">100%</h4>
              <span className="stat-item__label">Mức Độ Hài Lòng</span>
            </div>
          </div>
        </div>

        <div className="about__image-wrapper">
          <div className="about__image-overlay"></div>
          <img
            src={aboutCar}
            alt="Nội thất xe hơi sang trọng"
            className="about__image"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
