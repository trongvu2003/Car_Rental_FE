import "./ServicesSection.css";
import {
  ShieldCheck,
  Clock3,
  UserRoundCog,
  Settings,
  MapPinned,
  Star,
} from "lucide-react";

const services = [
  {
    icon: <ShieldCheck size={28} color="#C9A84C" strokeWidth={1.5} />,
    title: "Bảo Hiểm Toàn Diện",
    description:
      "Gói bảo hiểm toàn diện mang lại sự an tâm tuyệt đối cho bạn trên mọi hành trình.",
  },

  {
    icon: <Clock3 size={28} color="#C9A84C" strokeWidth={1.5} />,
    title: "Sẵn Sàng 24/7",
    description:
      "Dịch vụ hoạt động suốt ngày đêm, luôn sẵn sàng đáp ứng lịch trình của bạn bất cứ lúc nào.",
  },

  {
    icon: <UserRoundCog size={28} color="#C9A84C" strokeWidth={1.5} />,
    title: "Trợ Lý Cá Nhân",
    description:
      "Trợ lý cá nhân chuyên nghiệp giúp xử lý mọi yêu cầu của bạn một cách tinh tế và bảo mật.",
  },

  {
    icon: <Settings size={28} color="#C9A84C" strokeWidth={1.5} />,
    title: "Chất Lượng Thượng Lưu",
    description:
      "Hệ thống xe được bảo dưỡng tỉ mỉ, đảm bảo tình trạng và hiệu suất vận hành luôn hoàn hảo nhất.",
  },

  {
    icon: <MapPinned size={28} color="#C9A84C" strokeWidth={1.5} />,
    title: "Đưa Đón Linh Hoạt",
    description:
      "Giao và nhận xe vô cùng thuận tiện ngay tại địa điểm mà bạn mong muốn.",
  },

  {
    icon: <Star size={28} color="#C9A84C" strokeWidth={1.5} />,
    title: "Trải Nghiệm VIP",
    description:
      "Những đặc quyền và ưu đãi độc quyền chỉ dành riêng cho các khách hàng VIP của chúng tôi.",
  },
];

const ServicesSection = () => {
  return (
    <section className="services" id="services">
      <div className="services__container">
        <div className="services__header">
          <span className="section-tag">DỊCH VỤ CỦA CHÚNG TÔI</span>
          <h2 className="section-title">
            Dịch Vụ <span className="gold">Cao Cấp</span>
          </h2>
          <p className="services__header-desc">
            Trải nghiệm sự sang trọng bậc nhất với chuỗi dịch vụ cao cấp toàn
            diện, được thiết kế để vượt xa mọi kỳ vọng của bạn.
          </p>
        </div>

        <div className="services__grid">
          {services.map((s) => (
            <div className="service-card" key={s.title}>
              <div className="service-card__icon">{s.icon}</div>
              <h3 className="service-card__title">{s.title}</h3>
              <p className="service-card__desc">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
