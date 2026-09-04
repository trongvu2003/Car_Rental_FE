import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  Search,
  X,
  MoreVertical,
  Pencil,
  Trash2,
  Star,
  Calendar,
  Car as CarIcon,
} from "lucide-react";
import { useAllReviews, useReviewActions } from "../../../hooks/useReviews";
import type { Review } from "../../../types/review.type";
import "./ReviewsPage.css";

const RATING_ORDER = [5, 4, 3, 2, 1] as const;

const ratingMeta = (rating: number) => {
  if (rating >= 4) return { label: `${rating} sao`, className: "badge-good" };
  if (rating === 3)
    return { label: `${rating} sao`, className: "badge-neutral" };
  return { label: `${rating} sao`, className: "badge-bad" };
};

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

function MenuPortal({
  top,
  left,
  children,
  onClickInside,
}: {
  top: number;
  left: number;
  children: React.ReactNode;
  onClickInside: (e: React.MouseEvent) => void;
}) {
  return createPortal(
    <div className="rp-menu" style={{ top, left }} onClick={onClickInside}>
      {children}
    </div>,
    document.body
  );
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="rp-stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? "rp-star-filled" : "rp-star-empty"}
        />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const { reviews, loading, error, refetch } = useAllReviews();
  const {
    submitting,
    submitError,
    updateReview,
    deleting,
    deleteError,
    deleteReview,
  } = useReviewActions();

  const [query, setQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

  const [editingReview, setEditingReview] = useState<Review | null>(null);

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (openMenuId === id) {
      setOpenMenuId(null);
      return;
    }
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMenuPos({ top: rect.bottom + 4, left: Math.max(8, rect.right - 150) });
    setOpenMenuId(id);
  };

  useMemo(() => {
    if (!openMenuId) return;
  }, [openMenuId]);

  const filtered = useMemo(() => {
    return reviews.filter((r) => {
      const matchesRating = ratingFilter === "all" || r.rating === ratingFilter;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        r.comment?.toLowerCase().includes(q) ||
        r.user?.name?.toLowerCase().includes(q) ||
        r.car?.name?.toLowerCase().includes(q);
      return matchesRating && matchesQuery;
    });
  }, [reviews, ratingFilter, query]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return "0.0";
    return (
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    ).toFixed(1);
  }, [reviews]);

  const openEditForm = (review: Review) => {
    setOpenMenuId(null);
    setEditingReview(review);
  };

  const handleDelete = async (id: string) => {
    setOpenMenuId(null);
    if (!window.confirm("Xóa đánh giá này? Hành động không thể hoàn tác."))
      return;
    try {
      await deleteReview(id);
      refetch();
    } catch {
      window.alert(deleteError || "Không thể xóa đánh giá. Vui lòng thử lại.");
    }
  };

  const handleFormSubmit = async (data: {
    rating: number;
    comment: string;
  }) => {
    if (!editingReview) return;
    try {
      await updateReview(editingReview.id, data);
      setEditingReview(null);
      refetch();
    } catch {}
  };

  return (
    <div className="reviews-page" onClick={() => setOpenMenuId(null)}>
      <header className="rp-header">
        <div>
          <h1>Quản lý đánh giá</h1>
          <p>
            Tổng cộng {reviews.length} đánh giá · Điểm trung bình{" "}
            {averageRating}⭐
          </p>
        </div>
      </header>

      <section className="rp-toolbar">
        <div className="rp-search-box">
          <Search size={17} />
          <input
            type="text"
            placeholder="Tìm theo bình luận, người dùng, xe..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="rp-filter-chips">
          <button
            className={
              ratingFilter === "all" ? "rp-chip rp-chip-active" : "rp-chip"
            }
            onClick={() => setRatingFilter("all")}
          >
            Tất cả
          </button>
          {RATING_ORDER.map((r) => (
            <button
              key={r}
              className={
                ratingFilter === r ? "rp-chip rp-chip-active" : "rp-chip"
              }
              onClick={() => setRatingFilter(r)}
            >
              {r} sao
            </button>
          ))}
        </div>
      </section>

      {loading && (
        <div className="rp-state">Đang tải danh sách đánh giá...</div>
      )}
      {!loading && error && <div className="rp-state rp-error">{error}</div>}
      {!loading && !error && filtered.length === 0 && (
        <div className="rp-state">
          Không tìm thấy đánh giá phù hợp với bộ lọc hiện tại.
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="rp-grid">
          {filtered.map((review) => {
            const meta = ratingMeta(review.rating);
            return (
              <div className="rp-card" key={review.id}>
                <div className="rp-card-top">
                  <span className={`badge ${meta.className}`}>
                    {meta.label}
                  </span>
                  <button
                    className="rp-card-menu-btn"
                    onClick={(e) => toggleMenu(e, review.id)}
                  >
                    <MoreVertical size={16} />
                  </button>
                  {openMenuId === review.id && (
                    <MenuPortal
                      top={menuPos.top}
                      left={menuPos.left}
                      onClickInside={(e) => e.stopPropagation()}
                    >
                      <button onClick={() => openEditForm(review)}>
                        <Pencil size={14} /> Sửa đánh giá
                      </button>
                      <button
                        className="rp-menu-delete"
                        onClick={() => handleDelete(review.id)}
                        disabled={deleting}
                      >
                        <Trash2 size={14} /> Xóa đánh giá
                      </button>
                    </MenuPortal>
                  )}
                </div>

                <div className="rp-card-body">
                  <div className="rp-card-user-row">
                    <div className="rp-avatar">
                      {(review.user?.name || "?").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3>{review.user?.name || review.user_id}</h3>
                      <StarRow rating={review.rating} />
                    </div>
                  </div>

                  <p className="rp-comment">{review.comment}</p>

                  <div className="rp-card-specs">
                    <span>
                      <CarIcon size={13} /> {review.car?.name || review.car_id}
                    </span>
                    <span>
                      <Calendar size={13} /> {formatDate(review.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editingReview && (
        <ReviewFormDrawer
          initialReview={editingReview}
          submitting={submitting}
          submitError={submitError}
          onClose={() => setEditingReview(null)}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Edit form, sliding in from the right                               */
/* ------------------------------------------------------------------ */
function ReviewFormDrawer({
  initialReview,
  submitting,
  submitError,
  onClose,
  onSubmit,
}: {
  initialReview: Review;
  submitting: boolean;
  submitError: string | null;
  onClose: () => void;
  onSubmit: (data: { rating: number; comment: string }) => void;
}) {
  const [rating, setRating] = useState(initialReview.rating);
  const [comment, setComment] = useState(initialReview.comment);

  const canSubmit = comment.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({ rating, comment: comment.trim() });
  };

  return (
    <div className="rp-drawer-overlay" onClick={onClose}>
      <aside className="rp-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="rp-drawer-header">
          <h2>Sửa đánh giá</h2>
          <button className="rp-icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form className="rp-form" onSubmit={handleSubmit}>
          <div className="rp-field-full">
            <span className="rp-field-label">Người dùng</span>
            <p className="rp-readonly">
              {initialReview.user?.name || initialReview.user_id}
            </p>
          </div>

          <div className="rp-field-full">
            <span className="rp-field-label">Xe</span>
            <p className="rp-readonly">
              {initialReview.car?.name || initialReview.car_id}
            </p>
          </div>

          <label className="rp-field-full">
            Số sao
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} sao
                </option>
              ))}
            </select>
          </label>

          <label className="rp-field-full">
            Bình luận
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </label>

          {submitError && <div className="rp-form-error">{submitError}</div>}

          <div className="rp-form-actions">
            <button
              type="button"
              className="rp-secondary-btn"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rp-primary-btn"
              disabled={!canSubmit || submitting}
            >
              {submitting ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}
