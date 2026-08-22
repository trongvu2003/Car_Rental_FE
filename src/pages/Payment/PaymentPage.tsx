import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import bookingApi from "../../api/booking.api";
import type { Booking } from "../../types/booking.types";
import Toast, { ToastType } from "../../components/Toast";
import defaultCarImage from "../../assets/images/default.avif";
import { ArrowLeft } from "lucide-react";
import "./PaymentPage.css";

const PaymentPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [toast, setToast] = useState<{
    type: ToastType;
    message: string;
  } | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!id) return;

      try {
        setLoading(true);

        const data = await bookingApi.getBookingById(id);
        setBooking(data);
      } catch (err: any) {
        setError(err.message || "Không thể tải thông tin đơn đặt xe.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const formatPrice = (price: number) => `₫${price.toLocaleString("vi-VN")}`;

  const handlePay = () => {
    setToast({
      type: "success",
      message: "Chức năng thanh toán đang được phát triển.",
    });
  };

  if (loading) {
    return <div className="payment-page-loading">Đang tải dữ liệu...</div>;
  }

  if (error || !booking) {
    return (
      <div className="payment-page-error">
        ⚠ {error || "Không tìm thấy đơn đặt xe."}
      </div>
    );
  }

  return (
    <div className="payment-page">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="payment-page__container">
        <button className="payment-page__back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Quay lại
        </button>

        <h1 className="payment-page__title">Thanh toán đơn đặt xe</h1>

        {/* Thông tin booking */}
        <div className="payment-summary-card">
          <img
            src={booking.car?.images?.[0]?.image_url || defaultCarImage}
            alt={booking.car?.name || "Car"}
            className="payment-summary-card__img"
          />

          <div className="payment-summary-card__body">
            <span className="payment-summary-card__brand">
              {booking.car?.brand}
            </span>

            <h2 className="payment-summary-card__name">{booking.car?.name}</h2>

            <div className="payment-summary-card__dates">
              {booking.start_date} → {booking.end_date}
            </div>

            <div className="payment-summary-card__total">
              Tổng thanh toán
              <span>{formatPrice(booking.total_price)}</span>
            </div>
          </div>
        </div>

        <div className="payment-page__divider" />

        {/* Phương thức thanh toán */}
        <h3 className="payment-form-card__heading">
          Chọn phương thức thanh toán
        </h3>

        <div className="payment-methods">
          <button
            type="button"
            className="payment-method payment-method--momo active"
          >
            <span className="payment-method__badge">MoMo</span>

            <span className="payment-method__label">Ví điện tử MoMo</span>
          </button>

          <button
            type="button"
            className="payment-method payment-method--vnpay"
          >
            <span className="payment-method__badge">VNPAY</span>

            <span className="payment-method__label">
              Thẻ ATM / Internet Banking (VNPay)
            </span>
          </button>
        </div>

        {/* Nút thanh toán */}
        <button className="payment-confirm-btn" onClick={handlePay}>
          THANH TOÁN NGAY
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
