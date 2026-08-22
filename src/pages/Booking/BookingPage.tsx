import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import carApi from "../../api/car.api";
import { useBooking } from "../../hooks/useBooking";
import { useAuth } from "../../hooks/useAuth";
import type { Car } from "../../types/car.types";
import Toast, { ToastType } from "../../components/Toast";
import defaultCarImage from "../../assets/images/default.avif";
import { ArrowLeft, CalendarDays } from "lucide-react";
import "./BookingPage.css";

const toISODate = (d: Date) => d.toISOString().split("T")[0];

const BookingPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { submitting, createBooking } = useBooking();

  const today = useMemo(() => toISODate(new Date()), []);
  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return toISODate(d);
  }, []);

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(tomorrow);
  const [toast, setToast] = useState<{
    type: ToastType;
    message: string;
  } | null>(null);

  useEffect(() => {
    const fetchCar = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await carApi.getById(id);
        setCar(data);
      } catch (err: any) {
        setError(err.message || "Không thể tải thông tin xe.");
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  const totalDays = useMemo(() => {
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diff = Math.round(
      (e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff > 0 ? diff : 0;
  }, [startDate, endDate]);

  const totalPrice = useMemo(() => {
    if (!car) return 0;
    return totalDays * car.price_per_day;
  }, [car, totalDays]);

  const formatPrice = (price: number) => `₫${price.toLocaleString("vi-VN")}`;

  const handleStartDateChange = (value: string) => {
    setStartDate(value);
    // đảm bảo ngày trả xe luôn sau ngày nhận xe ít nhất 1 ngày
    if (new Date(value) >= new Date(endDate)) {
      const next = new Date(value);
      next.setDate(next.getDate() + 1);
      setEndDate(toISODate(next));
    }
  };

  const handleConfirmBooking = async () => {
    if (!isAuthenticated || !user) {
      setToast({
        type: "error",
        message: "Vui lòng đăng nhập để đặt xe.",
      });
      return;
    }
    if (!car) return;
    if (totalDays <= 0) {
      setToast({
        type: "error",
        message: "Ngày trả xe phải sau ngày nhận xe.",
      });
      return;
    }

    try {
      const booking = await createBooking({
        user_id: user.id,
        car_id: car.id,
        start_date: startDate,
        end_date: endDate,
      });

      // Booking đã tạo với status "pending" -> sang PaymentPage để chọn
      // phương thức và thực hiện thanh toán
      navigate(`/payment/${booking.id}`);
    } catch {
      setToast({
        type: "error",
        message: "Không thể tạo đơn đặt xe. Vui lòng thử lại.",
      });
    }
  };

  if (loading)
    return <div className="booking-page-loading">Đang tải dữ liệu...</div>;
  if (error || !car)
    return (
      <div className="booking-page-error">
        ⚠ {error || "Không tìm thấy xe."}
      </div>
    );

  return (
    <div className="booking-page">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="booking-page__container">
        <button className="booking-page__back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} /> Quay lại
        </button>

        <h1 className="booking-page__title">Xác nhận đặt xe</h1>

        <div className="booking-page__grid">
          {/* Cột trái: thông tin xe */}
          <div className="booking-summary-card">
            <img
              src={car.images?.[0]?.image_url || defaultCarImage}
              alt={car.name}
              className="booking-summary-card__img"
            />
            <div className="booking-summary-card__body">
              <span className="booking-summary-card__brand">{car.brand}</span>
              <h2 className="booking-summary-card__name">{car.name}</h2>
              <div className="booking-summary-card__price">
                {formatPrice(car.price_per_day)}
                <span> / ngày</span>
              </div>
            </div>
          </div>

          {/* Cột phải: form đặt xe */}
          <div className="booking-form-card">
            <h3 className="booking-form-card__heading">
              <CalendarDays size={18} color="#C9A84C" />
              Thời gian thuê
            </h3>

            <div className="booking-dates">
              <div className="booking-dates__field">
                <label>Ngày nhận xe</label>
                <input
                  type="date"
                  min={today}
                  value={startDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                />
              </div>
              <div className="booking-dates__field">
                <label>Ngày trả xe</label>
                <input
                  type="date"
                  min={startDate}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="booking-page__divider" />

            <div className="booking-breakdown">
              <div className="booking-breakdown__row">
                <span>
                  {formatPrice(car.price_per_day)} x {totalDays} ngày
                </span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="booking-breakdown__row booking-breakdown__row--total">
                <span>Tổng cộng</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <button
              className="booking-confirm-btn"
              onClick={handleConfirmBooking}
              disabled={submitting || totalDays <= 0}
            >
              {submitting ? "Đang tạo đơn..." : "XÁC NHẬN ĐẶT XE"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
