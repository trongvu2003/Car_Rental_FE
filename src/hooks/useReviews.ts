import { useState, useEffect } from "react";
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
