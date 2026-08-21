import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import carApi from "../../api/car.api";
import { useReviews } from "../../hooks/useReviews";
import { useAuth } from "../../hooks/useAuth";
import type { Car } from "../../types/car.types";
import Toast, { ToastType } from "../../components/Toast";
import defaultCarImage from "../../assets/images/default.avif";
import {
  Users,
  Fuel,
  Settings,
  Calendar,
  ShieldCheck,
  Check,
  ArrowLeft,
} from "lucide-react";
import "./CarDetail.css";

const fuelLabel: Record<string, string> = {
  gasoline: "Xăng",
  diesel: "Dầu",
  electric: "Điện",
};

const CarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string>("");

  const { reviews, loading: reviewsLoading, createReview } = useReviews(id);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [toast, setToast] = useState<{
    type: ToastType;
    message: string;
  } | null>(null);

  useEffect(() => {
    const fetchCarDetail = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await carApi.getById(id);
        setCar(data);
        setActiveImage(
          data.images && data.images.length > 0
            ? data.images[0].image_url
            : defaultCarImage
        );
      } catch (err: any) {
        setError(err.message || "Không thể tải thông tin xe.");
      } finally {
        setLoading(false);
      }
    };
    fetchCarDetail();
  }, [id]);

  const handleSubmitReview = async () => {
    if (!isAuthenticated || !user) {
      setToast({
        type: "error",
        message: "Vui lòng đăng nhập để gửi đánh giá.",
      });
      return;
    }

    if (!rating || !comment.trim()) return;

    try {
      setSubmitting(true);
      await createReview(user.id, rating, comment.trim());

      setRating(0);
      setComment("");
      setToast({ type: "success", message: "Cảm ơn bạn đã đánh giá!" });
    } catch (err: any) {
      setToast({
        type: "error",
        message: err.response?.data?.message || "Không thể gửi đánh giá.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price: number) => `₫${price.toLocaleString("vi-VN")}`;

  if (loading)
    return <div className="car-detail-loading">Đang tải dữ liệu...</div>;
  if (error || !car)
    return (
      <div className="car-detail-error">⚠ {error || "Không tìm thấy xe."}</div>
    );

  return (
    <div className="car-detail-page">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="car-detail__container">
        <button className="car-detail__back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} /> Quay lại
        </button>

        <div className="car-detail__grid">
          <div className="car-detail__gallery">
            <div className="car-detail__main-img-wrap">
              <img
                src={activeImage}
                alt={car.name}
                className="car-detail__main-img"
              />
            </div>
            {car.images && car.images.length > 1 && (
              <div className="car-detail__thumbnails">
                {car.images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`car-detail__thumb ${
                      activeImage === img.image_url ? "active" : ""
                    }`}
                    onClick={() => setActiveImage(img.image_url)}
                  >
                    <img
                      src={img.image_url}
                      alt={`${car.name} view ${idx + 1}`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="car-detail__info">
            <div className="car-detail__header">
              <span className="car-detail__brand">{car.brand}</span>
              <h1 className="car-detail__name">{car.name}</h1>
              <div className="car-detail__price-wrap">
                <span className="car-detail__price">
                  {formatPrice(car.price_per_day)}
                </span>
                <span className="car-detail__price-unit">/ ngày</span>
              </div>
            </div>

            <div className="car-detail__divider" />

            <div className="car-detail__specs-grid">
              {car.seats && (
                <div className="spec-item">
                  <Users size={20} color="#C9A84C" />
                  <div>
                    <span className="spec-label">Chỗ ngồi</span>
                    <span className="spec-value">{car.seats} Người</span>
                  </div>
                </div>
              )}
              {car.transmission && (
                <div className="spec-item">
                  <Settings size={20} color="#C9A84C" />
                  <div>
                    <span className="spec-label">Hộp số</span>
                    <span className="spec-value">
                      {car.transmission === "automatic" ? "Tự động" : "Số sàn"}
                    </span>
                  </div>
                </div>
              )}
              {car.fuel_type && (
                <div className="spec-item">
                  <Fuel size={20} color="#C9A84C" />
                  <div>
                    <span className="spec-label">Nhiên liệu</span>
                    <span className="spec-value">
                      {fuelLabel[car.fuel_type] || car.fuel_type}
                    </span>
                  </div>
                </div>
              )}
              {car.year && (
                <div className="spec-item">
                  <Calendar size={20} color="#C9A84C" />
                  <div>
                    <span className="spec-label">Đời xe</span>
                    <span className="spec-value">{car.year}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="car-detail__divider" />

            <div className="car-detail__desc">
              <h3>Tổng quan</h3>
              <p>
                {car.description ||
                  "Đang cập nhật mô tả chi tiết cho dòng xe này."}
              </p>
            </div>

            <div className="car-detail__features">
              <h3>Đặc quyền & Tiện ích</h3>
              <ul className="features-list">
                <li>
                  <Check size={18} color="#C9A84C" /> Bảo hiểm 2 chiều VIP
                </li>
                <li>
                  <Check size={18} color="#C9A84C" /> Giao xe tận nơi miễn phí
                </li>
                <li>
                  <Check size={18} color="#C9A84C" /> Hỗ trợ sự cố 24/7
                </li>
                <li>
                  <Check size={18} color="#C9A84C" /> Miễn phí rửa xe trước khi
                  giao
                </li>
              </ul>
            </div>

            <div className="car-detail__action">
              <button className="book-btn">ĐẶT XE NGAY</button>
              <button className="contact-btn">
                <ShieldCheck size={20} />
                Tư vấn thêm
              </button>
            </div>
          </div>
        </div>
        <div className="car-detail__reviews">
          <h3>Đánh giá khách hàng ({reviews.length})</h3>

          {isAuthenticated ? (
            <div className="review-form">
              <h4>Viết đánh giá của bạn</h4>

              <div className="review-form__stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className={(hoverRating || rating) >= star ? "active" : ""}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`${star} sao`}
                  >
                    ⭐
                  </button>
                ))}
              </div>

              <textarea
                placeholder="Chia sẻ trải nghiệm của bạn về chiếc xe này..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={500}
              />

              <div className="review-form__footer">
                <button
                  className="review-submit-btn"
                  onClick={handleSubmitReview}
                  disabled={!rating || !comment.trim() || submitting}
                >
                  {submitting ? "Đang gửi..." : "Gửi đánh giá"}
                </button>
              </div>
            </div>
          ) : (
            <div className="review-form review-form--locked">
              <p>
                Vui lòng <Link to="/login">đăng nhập</Link> để viết đánh giá.
              </p>
            </div>
          )}

          {reviewsLoading ? (
            <p>Đang tải đánh giá...</p>
          ) : reviews.length === 0 ? (
            <p>Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
          ) : (
            <div className="">
              {reviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <span className="review-author">
                      {review.user?.name || "Khách hàng"}
                    </span>
                    <div className="review-rating">
                      {"⭐".repeat(review.rating)}
                    </div>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                  <span className="review-date">
                    {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarDetail;
