import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  Trash2,
  Car as CarIcon,
} from "lucide-react";

import { useBooking } from "../../hooks/useBooking";
import "./MyBookings.css";

const MyBookings = () => {
  const {
    bookings,
    loading,
    error,
    fetchMyBookings,
    deleting,
    deleteError,
    deleteBooking,
    deleteMultipleBookings,
  } = useBooking();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [brokenImageIds, setBrokenImageIds] = useState<Set<string>>(new Set());
  const getCarImageUrl = (booking: any): string | null => {
    const car = booking.car || booking.Car;
    if (!car) return null;
    const flatUrl = car.image_url || car.imageUrl || car.image || car.thumbnail;
    if (flatUrl) return flatUrl;
    const images = car.images;
    if (Array.isArray(images) && images.length > 0) {
      const first = images[0];
      return (
        first?.image_url || first?.url || first?.image || first?.path || null
      );
    }

    return null;
  };

  useEffect(() => {
    fetchMyBookings();
  }, [fetchMyBookings]);
  useEffect(() => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      let changed = false;
      next.forEach((id) => {
        if (!bookings.some((b) => b.id === id)) {
          next.delete(id);
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [bookings]);

  const allSelected =
    bookings.length > 0 && selectedIds.size === bookings.length;
  const someSelected = selectedIds.size > 0;

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds(
      allSelected ? new Set() : new Set(bookings.map((b: any) => b.id))
    );
  };

  const handleDeleteOne = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa đơn đặt xe này?")) return;
    try {
      await deleteBooking(id);
    } catch {}
  };

  const handleDeleteSelected = async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    if (
      !window.confirm(`Bạn có chắc muốn xóa ${ids.length} đơn đặt xe đã chọn?`)
    )
      return;
    try {
      await deleteMultipleBookings(ids);
      setSelectedIds(new Set());
    } catch {}
  };

  const selectedCount = useMemo(() => selectedIds.size, [selectedIds]);

  const renderPaymentStatus = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return (
          <span className="status-badge status-paid">
            <CheckCircle size={14} /> Đã thanh toán
          </span>
        );
      case "pending":
        return (
          <span className="status-badge status-pending">
            <Clock size={14} /> Chờ thanh toán
          </span>
        );
      case "failed":
      case "cancelled":
        return (
          <span className="status-badge status-cancelled">
            <XCircle size={14} /> Đã hủy/Thất bại
          </span>
        );
      default:
        return <span className="status-badge">{status || "Chưa rõ"}</span>;
    }
  };

  if (loading)
    return <div className="booking-page-loading">Đang tải dữ liệu...</div>;
  if (error) return <div className="booking-page-error">{error}</div>;

  return (
    <div className="bookings-page">
      <div className="bookings-container">
        <span className="bookings-eyebrow">Lịch sử</span>
        <h1 className="bookings-title">Chuyến đi của tôi</h1>

        {deleteError && (
          <div className="bookings-delete-error">{deleteError}</div>
        )}

        {bookings.length === 0 ? (
          <div className="empty-state">
            <p>Bạn chưa có chuyến đi nào.</p>
            <Link to="/" className="btn-primary">
              Khám phá xe ngay
            </Link>
          </div>
        ) : (
          <>
            <div className="bookings-toolbar">
              <label className="bookings-toolbar__select-all">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                />
                <span>{allSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}</span>
              </label>

              {someSelected && (
                <button
                  type="button"
                  className="btn-delete-selected"
                  onClick={handleDeleteSelected}
                  disabled={deleting}
                >
                  <Trash2 size={16} />
                  {deleting ? "Đang xóa..." : `Xóa (${selectedCount})`}
                </button>
              )}
            </div>

            <div className="bookings-list">
              {/* Dùng any tạm thời ở đây để tránh lỗi TypeScript nếu type Booking gốc của bạn chưa có trường Car */}
              {bookings.map((booking: any) => {
                const isSelected = selectedIds.has(booking.id);
                return (
                  <div
                    key={booking.id}
                    className={`booking-card${
                      isSelected ? " booking-card--selected" : ""
                    }`}
                  >
                    <label className="booking-card__checkbox">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(booking.id)}
                      />
                    </label>

                    <div className="booking-card__media">
                      {(() => {
                        const imgUrl = getCarImageUrl(booking);
                        const hasValidImg =
                          imgUrl && !brokenImageIds.has(booking.id);
                        if (hasValidImg) {
                          return (
                            <img
                              src={imgUrl as string}
                              alt={
                                booking.car?.name ||
                                booking.Car?.name ||
                                "Hình ảnh xe"
                              }
                              className="booking-card__img"
                              onError={() =>
                                setBrokenImageIds((prev) =>
                                  new Set(prev).add(booking.id)
                                )
                              }
                            />
                          );
                        }
                        return (
                          <div className="booking-card__img-fallback">
                            <CarIcon size={40} strokeWidth={1.25} />
                          </div>
                        );
                      })()}
                    </div>

                    <div className="booking-card__content">
                      <div className="booking-header">
                        <h3>
                          {booking.car?.name ||
                            booking.Car?.name ||
                            `Mã đơn: ${booking.id
                              .substring(0, 8)
                              .toUpperCase()}`}
                        </h3>
                        {renderPaymentStatus(
                          booking.payment_status || booking.status
                        )}
                      </div>

                      <div className="booking-body">
                        <div className="info-row">
                          <Calendar size={16} className="info-icon" />
                          <span>
                            <strong>Ngày nhận:</strong>{" "}
                            {new Date(booking.start_date).toLocaleDateString(
                              "vi-VN"
                            )}
                            {" — "}
                            <strong>Ngày trả:</strong>{" "}
                            {new Date(booking.end_date).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                        </div>

                        <div className="info-row">
                          <DollarSign size={16} className="info-icon" />
                          <span>
                            <strong>Tổng tiền:</strong>{" "}
                            {Number(booking.total_price).toLocaleString(
                              "vi-VN"
                            )}{" "}
                            VNĐ
                          </span>
                        </div>
                      </div>

                      <div className="booking-footer">
                        <button
                          type="button"
                          className="btn-delete-one"
                          onClick={() => handleDeleteOne(booking.id)}
                          disabled={deleting}
                          title="Xóa đơn này"
                        >
                          <Trash2 size={16} />
                        </button>
                        <Link
                          to={`/bookings/${booking.id}`}
                          className="btn-details"
                        >
                          Xem chi tiết <ChevronRight size={16} />
                        </Link>
                        {(booking.payment_status === "pending" ||
                          booking.status === "pending") && (
                          <Link
                            to={`/payment/${booking.id}`}
                            className="btn-pay-now"
                          >
                            Thanh toán ngay
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
