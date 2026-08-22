import { JSX, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import bookingApi from "../../api/booking.api";
import type { Booking } from "../../types/booking.types";
import defaultCarImage from "../../assets/images/default.avif";
import { ArrowLeft, CheckCircle2, Clock, XCircle } from "lucide-react";
import "./BookingDetail.css";

const statusLabel: Record<Booking["status"], string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  cancelled: "Đã hủy",
  completed: "Hoàn tất",
};

const paymentStatusMeta: Record<
  Booking["payment_status"],
  { label: string; icon: JSX.Element; className: string }
> = {
  paid: {
    label: "Thanh toán thành công",
    icon: <CheckCircle2 size={20} />,
    className: "payment-badge--paid",
  },
  pending: {
    label: "Đang chờ xác nhận thanh toán",
    icon: <Clock size={20} />,
    className: "payment-badge--pending",
  },
  failed: {
    label: "Thanh toán thất bại",
    icon: <XCircle size={20} />,
    className: "payment-badge--failed",
  },
};

const BookingDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    fetchBooking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const formatPrice = (price: number) => `₫${price.toLocaleString("vi-VN")}`;
  const formatDate = (d: string) => new Date(d).toLocaleDateString("vi-VN");

  if (loading)
    return <div className="booking-detail-loading">Đang tải dữ liệu...</div>;
  if (error || !booking)
    return (
      <div className="booking-detail-error">
        ⚠ {error || "Không tìm thấy đơn đặt xe."}
      </div>
    );

  const meta = paymentStatusMeta[booking.payment_status];

  return (
    <div className="booking-detail-page">
      <div className="booking-detail-page__container">
        <button
          className="booking-detail-page__back-btn"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} /> Quay lại
        </button>

        <div className={`payment-badge ${meta.className}`}>
          {meta.icon}
          <span>{meta.label}</span>
        </div>

        <h1 className="booking-detail-page__title">Chi tiết đơn đặt xe</h1>

        <div className="booking-detail-card">
          <img
            src={booking.car?.images?.[0]?.image_url || defaultCarImage}
            alt={booking.car?.name}
            className="booking-detail-card__img"
          />
          <div className="booking-detail-card__body">
            <span className="booking-detail-card__brand">
              {booking.car?.brand}
            </span>
            <h2 className="booking-detail-card__name">{booking.car?.name}</h2>

            <div className="booking-detail-rows">
              <div className="booking-detail-row">
                <span>Mã đơn</span>
                <span>{booking.id}</span>
              </div>
              <div className="booking-detail-row">
                <span>Ngày nhận xe</span>
                <span>{formatDate(booking.start_date)}</span>
              </div>
              <div className="booking-detail-row">
                <span>Ngày trả xe</span>
                <span>{formatDate(booking.end_date)}</span>
              </div>
              <div className="booking-detail-row">
                <span>Trạng thái đơn</span>
                <span>{statusLabel[booking.status]}</span>
              </div>
              <div className="booking-detail-row booking-detail-row--total">
                <span>Tổng tiền</span>
                <span>{formatPrice(booking.total_price)}</span>
              </div>
            </div>

            {booking.payment_status === "pending" && (
              <button
                className="booking-detail-retry-btn"
                onClick={() => navigate(`/payment/${booking.id}`)}
              >
                Thanh toán ngay
              </button>
            )}

            {booking.payment_status === "failed" && (
              <button
                className="booking-detail-retry-btn"
                onClick={() => navigate(`/payment/${booking.id}`)}
              >
                Thử thanh toán lại
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailPage;
