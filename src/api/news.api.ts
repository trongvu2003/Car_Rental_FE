import axiosInstance from "./axios";
import type { NewsResponse } from "../types/news.types";

export const getCarNewsApi = async (): Promise<NewsResponse> => {
  try {
    const response = await axiosInstance.get<NewsResponse>("/news");
    return response.data;
  } catch (error) {
    throw new Error("Không thể kết nối tới máy chủ.");
  }
};
