import axiosInstance from "./axios";
import { Review } from "../types/review.type";

const reviewApi = {
  getReviewByCar: async (carId: string): Promise<Review[]> => {
    const response = await axiosInstance.get<Review[]>(`/reviews/car/${carId}`);
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
};

export default reviewApi;
