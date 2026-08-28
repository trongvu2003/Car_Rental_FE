import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import bookingApi from "../../api/booking.api";
import usePayment from "../../hooks/usePayment";
import type { Booking } from "../../types/booking.types";
import type { PaymentMethod } from "../../types/payment.types";
import Toast, { ToastType } from "../../components/Toast";
import defaultCarImage from "../../assets/images/default.avif";
import momoLogo from "../../assets/images/momo.webp";
import vnpayLogo from "../../assets/images/vnpay.jpg";
import cashLogo from "../../assets/images/cash.png";
import {
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Check,
  CalendarRange,
} from "lucide-react";
import "./PaymentPage.css";

const PAYMENT_METHODS: {
  value: PaymentMethod;
  label: string;
  desc: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "momo",
    label: "Ví MoMo",
    desc: "Quét QR hoặc đăng nhập ví MoMo",
    icon: (
      <img
        src={momoLogo}
        alt="MoMo"
        style={{ width: "24px", height: "24px", objectFit: "contain" }}
      />
    ),
  },
  {
    value: "vnpay",
    label: "VNPay",
    desc: "Thẻ ATM / Internet Banking",
    icon: (
      <img
        src={vnpayLogo}
        alt="VNPay"
        style={{ width: "24px", height: "24px", objectFit: "contain" }}
      />
    ),
  },
  {
    value: "cash",
    label: "Tiền mặt",
    desc: "Thanh toán khi nhận xe",
    icon: (
      <img
        src={cashLogo}
        alt="Tiền mặt"
        style={{ width: "24px", height: "24px", objectFit: "contain" }}
      />
    ),
  },
];
const getCarImageUrl = (booking: Booking): string => {
  const car: any = booking.car;
  return (
    car?.images?.[0]?.image_url ||
    car?.images?.[0]?.url ||
    car?.image_url ||
    car?.thumbnail ||
    defaultCarImage
  );
};

const formatPrice = (price: number) => `₫${price.toLocaleString("vi-VN")}`;

const formatDate = (value: string) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
};

const getDurationLabel = (start: string, end: string) => {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  if (Number.isNaN(s) || Number.isNaN(e)) return null;
  const days = Math.max(1, Math.round((e - s) / (1000 * 60 * 60 * 24)));
  return `${days} ngày`;
};

const PaymentPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("momo");
  const { submitting, error: payError, pay, resetError } = usePayment();

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

  useEffect(() => {
    if (payError) {
      setToast({ type: "error", message: payError });
      resetError();
    }
  }, [payError]);

  const handlePay = async () => {
    if (!booking || submitting) return;

    const result = await pay({
      booking_id: booking.id,
      payment_method: selectedMethod,
    });

    if (!result) return;

    if (result.payment_url) {
      window.location.href = result.payment_url;
      return;
    }

    setToast({
      type: "success",
      message: "Đặt xe thành công! Vui lòng thanh toán khi nhận xe.",
    });

    setTimeout(() => navigate(`/bookings/${booking.id}`), 1200);
  };

  if (loading) {
    return (
      <div className="payment-state">
        <div className="payment-state__spinner" />
        <p>Đang tải thông tin đơn đặt xe...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="payment-state payment-state--error">
        <p>⚠ {error || "Không tìm thấy đơn đặt xe."}</p>
        <button onClick={() => navigate(-1)}>Quay lại</button>
      </div>
    );
  }

  const duration = getDurationLabel(booking.start_date, booking.end_date);

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
          <ArrowLeft size={18} />
          Quay lại
        </button>

        <div className="payment-page__heading">
          <span className="payment-page__eyebrow">Bước cuối cùng</span>
          <h1 className="payment-page__title">Xác nhận &amp; thanh toán</h1>
        </div>

        {/* TICKET */}
        <div className="ticket">
          <div className="ticket__top">
            <img
              src={getCarImageUrl(booking)}
              alt={booking.car?.name || "Car"}
              className="ticket__img"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = defaultCarImage;
              }}
            />

            <div className="ticket__info">
              <span className="ticket__brand">{booking.car?.brand}</span>
              <h2 className="ticket__name">{booking.car?.name}</h2>

              <div className="ticket__dates">
                <CalendarRange size={14} />
                {formatDate(booking.start_date)} →{" "}
                {formatDate(booking.end_date)}
                {duration && (
                  <span className="ticket__duration">{duration}</span>
                )}
              </div>
            </div>
          </div>

          <div className="ticket__divider" role="presentation" />

          <div className="ticket__total">
            <span className="ticket__total-label">Tổng thanh toán</span>
            <span className="ticket__total-amount">
              {formatPrice(booking.total_price)}
            </span>
          </div>
        </div>

        {/* PAYMENT METHODS */}
        <h3 className="payment-page__section-title">
          Chọn phương thức thanh toán
        </h3>

        <div className="payment-methods" role="radiogroup">
          {PAYMENT_METHODS.map((method) => {
            const active = selectedMethod === method.value;
            return (
              <button
                key={method.value}
                type="button"
                role="radio"
                aria-checked={active}
                className={`payment-method ${active ? "is-active" : ""}`}
                onClick={() => setSelectedMethod(method.value)}
                disabled={submitting}
              >
                <span className="payment-method__icon">{method.icon}</span>

                <span className="payment-method__text">
                  <span className="payment-method__label">{method.label}</span>
                  <span className="payment-method__desc">{method.desc}</span>
                </span>

                <span className="payment-method__check" aria-hidden="true">
                  {active && <Check size={13} strokeWidth={3} />}
                </span>
              </button>
            );
          })}
        </div>

        <div className="payment-page__note">
          <ShieldCheck size={15} />
          {selectedMethod === "cash"
            ? "Đơn được xác nhận ngay, thanh toán khi nhận xe."
            : "Giao dịch được mã hóa và bảo mật bởi cổng thanh toán đối tác."}
        </div>

        <button
          className="payment-cta"
          onClick={handlePay}
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 size={18} className="payment-cta__spinner" />
              Đang xử lý...
            </>
          ) : selectedMethod === "cash" ? (
            "Xác nhận đặt xe"
          ) : (
            <>
              Thanh toán{" "}
              <span className="payment-cta__amount">
                {formatPrice(booking.total_price)}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
