import { useMemo, useState } from "react";
import { useCars } from "../../hooks/useCars";
import type { Car } from "../../types/car.types";
import {
  Zap,
  Users,
  Fuel,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./CarsPage.css";

const IconSeats = () => <Users size={18} color="#C9A84C" strokeWidth={1.5} />;
const IconYear = () => <Zap size={18} color="#C9A84C" strokeWidth={1.5} />;
const IconFuel = () => <Fuel size={16} color="#C9A84C" strokeWidth={1.5} />;

const getCarImage = (car: Car): string => {
  if (car.images && car.images.length > 0) return car.images[0].image_url;
  return "../assets/default.avif";
};

const formatPrice = (price: number): string =>
  `₫${price.toLocaleString("vi-VN")}`;

const fuelLabel: Record<string, string> = {
  gasoline: "Xăng",
  diesel: "Dầu",
  electric: "Điện",
};

const PAGE_SIZE = 100;

const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-shimmer" />
  </div>
);

const CarsPage = () => {
  const { cars, loading, error } = useCars({ status: "available" });
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("all");
  const [fuel, setFuel] = useState("all");
  const [sort, setSort] = useState<"default" | "price_asc" | "price_desc">(
    "default"
  );
  const [page, setPage] = useState(1);

  const brands = useMemo(() => {
    const set = new Set(cars.map((c) => c.brand).filter(Boolean));
    return Array.from(set);
  }, [cars]);

  const filtered = useMemo(() => {
    let result = [...cars];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) || c.brand.toLowerCase().includes(q)
      );
    }

    if (brand !== "all") {
      result = result.filter((c) => c.brand === brand);
    }

    if (fuel !== "all") {
      result = result.filter((c) => c.fuel_type === fuel);
    }

    if (sort === "price_asc") {
      result.sort((a, b) => a.price_per_day - b.price_per_day);
    } else if (sort === "price_desc") {
      result.sort((a, b) => b.price_per_day - a.price_per_day);
    }

    return result;
  }, [cars, search, brand, fuel, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  const handleFilterChange = (fn: () => void) => {
    fn();
    setPage(1);
  };

  const pageNumbers = useMemo(() => {
    const pages: (number | "...")[] = [];
    const delta = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  }, [totalPages, currentPage]);

  return (
    <main className="cars-page">
      <div className="cars-page__header">
        <span className="cars-page__tag">TOÀN BỘ BỘ SƯU TẬP</span>
        <h1 className="cars-page__title">
          Danh sách <span className="gold">xe cho thuê</span>
        </h1>
        <p className="cars-page__subtitle">
          Tìm kiếm và lựa chọn chiếc xe phù hợp nhất với hành trình của bạn.
        </p>
      </div>

      <div className="cars-page__filters">
        <div className="cars-page__search">
          <Search size={16} color="rgba(255,255,255,0.4)" />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc hãng xe..."
            value={search}
            onChange={(e) =>
              handleFilterChange(() => setSearch(e.target.value))
            }
          />
        </div>

        <select
          value={brand}
          onChange={(e) => handleFilterChange(() => setBrand(e.target.value))}
        >
          <option value="all">Tất cả hãng xe</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        <select
          value={fuel}
          onChange={(e) => handleFilterChange(() => setFuel(e.target.value))}
        >
          <option value="all">Tất cả nhiên liệu</option>
          <option value="gasoline">Xăng</option>
          <option value="diesel">Dầu</option>
          <option value="electric">Điện</option>
        </select>

        <select
          value={sort}
          onChange={(e) =>
            handleFilterChange(() => setSort(e.target.value as typeof sort))
          }
        >
          <option value="default">Sắp xếp mặc định</option>
          <option value="price_asc">Giá: Thấp đến cao</option>
          <option value="price_desc">Giá: Cao đến thấp</option>
        </select>
      </div>

      {error && (
        <div className="cars-page__error">
          <span>⚠ {error}</span>
        </div>
      )}

      <div className="cars-page__meta">
        {!loading && (
          <span>
            Hiển thị {paginated.length} / {filtered.length} xe
          </span>
        )}
      </div>

      <div className="cars-page__grid">
        {loading
          ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          : paginated.map((car) => (
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
                          <IconYear />
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

      {!loading && filtered.length === 0 && (
        <div className="cars-page__empty">
          Không tìm thấy xe phù hợp với bộ lọc hiện tại.
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="cars-page__pagination">
          <button
            className="page-btn"
            disabled={currentPage === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft size={16} />
          </button>

          {pageNumbers.map((p, idx) =>
            p === "..." ? (
              <span key={`dots-${idx}`} className="page-dots">
                …
              </span>
            ) : (
              <button
                key={p}
                className={`page-btn ${
                  p === currentPage ? "page-btn--active" : ""
                }`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            )
          )}

          <button
            className="page-btn"
            disabled={currentPage === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </main>
  );
};

export default CarsPage;
