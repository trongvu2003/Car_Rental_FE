import { useState, useEffect } from "react";
import reviewApi from "../api/review.api";
import type { Review } from "../types/review.type";

export const useReviews = (carId?: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!carId) return;
    const fetchReview = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await reviewApi.getReviewByCar(carId);
        setReviews(data);
      } catch (err: any) {
        setError(err.message || "Lôi tải đánh giá");
      } finally {
        setLoading(false);
      }
    };
    fetchReview();
  }, [carId]);

  return {
    reviews,
    loading,
    error,
  };
};
