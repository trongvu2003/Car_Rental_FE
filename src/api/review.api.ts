import axiosInstance from "./axios";
import { Review } from "../types/review.type";

const reviewApi = {
  getReviewByCar: async (carId: string): Promise<Review[]> => {
    const response = await axiosInstance.get<Review[]>(`/reviews/car/${carId}`);
    return response.data;
  },
};

export default reviewApi;
