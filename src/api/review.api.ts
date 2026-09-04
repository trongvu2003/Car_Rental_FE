import axiosInstance from "./axios";
import { Review } from "../types/review.type";

const reviewApi = {
  getReviewByCar: async (carId: string): Promise<Review[]> => {
    const response = await axiosInstance.get<Review[]>(`/reviews/car/${carId}`);
    return response.data;
  },

  getAllReviews: async (): Promise<Review[]> => {
    const response = await axiosInstance.get<Review[]>(`/reviews`);
    return response.data;
  },

  createReview: async (data: {
    user_id: string;
    car_id: string;
    rating: number;
    comment: string;
  }): Promise<Review> => {
    const response = await axiosInstance.post<Review>(`/reviews`, data);
    return response.data;
  },

  updateReview: async (
    id: string,
    data: Partial<{ rating: number; comment: string }>
  ): Promise<Review> => {
    const response = await axiosInstance.patch<Review>(`/reviews/${id}`, data);
    return response.data;
  },

  deleteReview: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/reviews/${id}`);
  },
};

export default reviewApi;
