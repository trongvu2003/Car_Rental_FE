import { useEffect, useRef } from "react";
import "./HeroSection.css";
import heroBg from "../../assets/images/hero-car.jpg";
import { ChevronDown } from "lucide-react";

const HeroSection = () => {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    el.classList.add("animate-in");
  }, []);

  const scrollDown = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <section className="hero" id="home">
      <div className="hero__bg" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="hero__bg-overlay" />
        <div className="hero__vignette" />
      </div>
      <div className="hero__content" ref={textRef}>
        <span className="hero__badge">
          Dịch vụ cho thuê xe cao cấp tại Việt Nam
        </span>

        <h1 className="hero__title">
          <span className="hero__title-line hero__title-white">
            Trải nghiệm
          </span>
          <span className="hero__title-line hero__title-gold">
            Đẳng cấp trong từng chuyển động
          </span>
        </h1>

        <p className="hero__subtitle">
          Thuê những dòng xe đẳng cấp thế giới với trải nghiệm sang trọng, mạnh
          mẽ và khác biệt.
        </p>

        <div className="hero__actions">
          <a href="#collection" className="btn btn--gold">
            Xem bộ sưu tập
          </a>
          <a href="#contact" className="btn btn--outline">
            Tư vấn ngay
          </a>
        </div>
        <div className="hero__stats">
          {[
            { value: "50+", label: "Dòng xe cao cấp" },
            { value: "5★", label: "Dịch vụ đẳng cấp" },
            { value: "10k+", label: "Khách hàng tin tưởng" },
          ].map((s) => (
            <div key={s.label} className="hero__stat">
              <span className="hero__stat-value">{s.value}</span>
              <span className="hero__stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
      <button
        className="hero__scroll"
        onClick={scrollDown}
        aria-label="Scroll down"
      >
        <ChevronDown color="#C9A84C" size={24} strokeWidth={1.5} />
      </button>
    </section>
  );
};

export default HeroSection;
