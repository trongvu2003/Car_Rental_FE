import "./FeaturedCars.css";
import { useCars } from "../../hooks/useCars";
import type { Car } from "../../types/car.types";
import { Zap, Users, Fuel } from "lucide-react";
import { Link } from "react-router-dom";

const IconHP = () => <Zap size={22} color="#C9A84C" strokeWidth={1.5} />;
const IconSeats = () => <Users size={22} color="#C9A84C" strokeWidth={1.5} />;
const IconFuel = () => <Fuel size={18} color="#C9A84C" strokeWidth={1.5} />;
const getCarImage = (car: Car): string => {
  if (car.images && car.images.length > 0) return car.images[0].image_url;
  return "../../assets/default.avif";
};

const formatPrice = (price: number): string =>
  `₫${price.toLocaleString("vi-VN")}`;

const fuelLabel: Record<string, string> = {
  gasoline: "Xăng",
  diesel: "Dầu",
  electric: "Điện",
};

const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-shimmer" />
  </div>
);
const FeaturedCars = () => {
  const { cars, loading, error } = useCars({
    limit: 4,
    status: "available",
  });

  return (
    <section className="featured" id="collection">
      <div className="featured__header">
        <span className="featured__tag">BỘ SƯU TẬP ĐỘC QUYỀN</span>

        <h2 className="featured__title">
          Bộ sưu tập <span className="gold">xe sang</span>
        </h2>

        <p className="featured__subtitle">
          Khám phá những mẫu xe đẳng cấp được tuyển chọn kỹ lưỡng, mang đến trải
          nghiệm lái xe sang trọng và khác biệt.
        </p>
      </div>

      {error && (
        <div className="featured__error">
          <span>⚠ {error}</span>
        </div>
      )}

      <div className="featured__grid">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : cars.map((car) => (
              <Link
                to={`/cars/${car.id}`}
                className="car-card-link"
                key={car.id}
              >
                <div className="car-card">
                  <div className="car-card__img-wrap">
                    <img
                      src={getCarImage(car)}
                      alt={car.name}
                      className="car-card__img"
                      loading="lazy"
                    />
                    <span className="car-card__badge">Cao cấp</span>
                  </div>
                  <div className="car-card__body">
                    <span className="car-card__brand">{car.brand}</span>
                    <h3 className="car-card__name">{car.name}</h3>
                    <div className="car-card__divider" />
                    <div className="car-card__specs">
                      {car.seats && (
                        <div className="car-card__spec">
                          <IconSeats />
                          <span>{car.seats} chỗ</span>
                        </div>
                      )}
                      {car.year && (
                        <div className="car-card__spec">
                          <IconHP />
                          <span>{car.year}</span>
                        </div>
                      )}
                      {car.fuel_type && (
                        <div className="car-card__spec">
                          <IconFuel />
                          <span>
                            {fuelLabel[car.fuel_type] ?? car.fuel_type}
                          </span>
                        </div>
                      )}
                      {car.transmission && (
                        <div className="car-card__spec car-card__spec--trans">
                          <span
                            className={`trans-badge trans-badge--${car.transmission}`}
                          >
                            {car.transmission === "automatic"
                              ? "Tự động"
                              : "Số sàn"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="car-card__divider" />
                    <div className="car-card__footer">
                      <div className="car-card__price-block">
                        <span className="car-card__price-label">Giá từ</span>
                        <span className="car-card__price">
                          {formatPrice(car.price_per_day)}
                          <small>/ngày</small>
                        </span>
                      </div>
                      <span className="car-card__reserve">Đặt xe</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
      </div>
      <div className="featured__actions">
        <Link to="/cars" className="featured__view-all">
          Xem tất cả xe
        </Link>
      </div>
    </section>
  );
};

export default FeaturedCars;
