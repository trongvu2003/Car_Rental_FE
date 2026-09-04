import { useCallback, useEffect, useState } from "react";
import reviewApi from "../api/review.api";
import type { Review } from "../types/review.type";

export const useReviews = (carId?: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!carId) return;

    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await reviewApi.getReviewByCar(carId);

        setReviews(data);
      } catch (err: any) {
        setError(err.message || "Lỗi tải đánh giá");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [carId]);

  const createReview = async (
    userId: string,
    rating: number,
    comment: string
  ) => {
    if (!carId) return;

    await reviewApi.createReview({
      user_id: userId,
      car_id: carId,
      rating,
      comment,
    });
    const data = await reviewApi.getReviewByCar(carId);

    setReviews(data);
  };

  return {
    reviews,
    loading,
    error,
    createReview,
  };
};

//  Dùng cho trang quản lý (admin) - lấy toàn bộ review, không lọc theo xe
export const useAllReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await reviewApi.getAllReviews();

      setReviews(data);
    } catch (err: any) {
      setError(err.message || "Lỗi tải đánh giá");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return {
    reviews,
    loading,
    error,
    refetch: fetchReviews,
  };
};

//  Hành động sửa/xóa review dùng trong trang quản lý (admin)
export const useReviewActions = () => {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const updateReview = async (
    id: string,
    data: Partial<{ rating: number; comment: string }>
  ) => {
    try {
      setSubmitting(true);
      setSubmitError(null);
      return await reviewApi.updateReview(id, data);
    } catch (err: any) {
      const msg = err.message || "Cập nhật thất bại";
      setSubmitError(msg);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteReview = async (id: string) => {
    try {
      setDeleting(true);
      setDeleteError(null);
      return await reviewApi.deleteReview(id);
    } catch (err: any) {
      const msg = err.message || "Xoá thất bại";
      setDeleteError(msg);
      throw err;
    } finally {
      setDeleting(false);
    }
  };

  return {
    submitting,
    submitError,
    updateReview,
    deleting,
    deleteError,
    deleteReview,
  };
};
