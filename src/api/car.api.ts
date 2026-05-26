import axiosInstance from "./axios";
import type {
  Car,
  CarQueryParams,
  PaginatedResponse,
} from "../types/car.types";

const CAR_ENDPOINT = "/cars";

export const carApi = {
  getAll: async (params?: CarQueryParams): Promise<Car[]> => {
    const response = await axiosInstance.get<Car[] | PaginatedResponse<Car>>(
      CAR_ENDPOINT,
      { params }
    );
    const data = response.data;
    return Array.isArray(data) ? data : data.data;
  },

  //   getById: async (id: string): Promise<Car> => {
  //     const response = await axiosInstance.get<Car>(`${CAR_ENDPOINT}/${id}`);
  //     return response.data;
  //   },

  //   create: async (formData: FormData): Promise<Car> => {
  //     const response = await axiosInstance.post<Car>(CAR_ENDPOINT, formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });
  //     return response.data;
  //   },

  //   update: async (id: string, formData: FormData): Promise<Car> => {
  //     const response = await axiosInstance.put<Car>(
  //       `${CAR_ENDPOINT}/${id}`,
  //       formData,
  //       { headers: { "Content-Type": "multipart/form-data" } }
  //     );
  //     return response.data;
  //   },

  //   delete: async (id: string): Promise<void> => {
  //     await axiosInstance.delete(`${CAR_ENDPOINT}/${id}`);
  //   },
};
