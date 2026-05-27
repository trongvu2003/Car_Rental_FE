import axiosInstance from "./axios";
import type {
  Car,
  CarQueryParams,
  PaginatedResponse,
} from "../types/car.types";

const carApi = {
  getAll: async (params?: CarQueryParams): Promise<Car[]> => {
    const response = await axiosInstance.get<Car[] | PaginatedResponse<Car>>(
      "/cars",
      { params }
    );
    const data = response.data;
    return Array.isArray(data) ? data : data.data;
  },

  //   getById: async (id: string): Promise<Car> => {
  //     const response = await axiosInstance.get<Car>(`${"/cars"}/${id}`);
  //     return response.data;
  //   },

  //   create: async (formData: FormData): Promise<Car> => {
  //     const response = await axiosInstance.post<Car>("/cars", formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });
  //     return response.data;
  //   },

  //   update: async (id: string, formData: FormData): Promise<Car> => {
  //     const response = await axiosInstance.put<Car>(
  //       `${"/cars"}/${id}`,
  //       formData,
  //       { headers: { "Content-Type": "multipart/form-data" } }
  //     );
  //     return response.data;
  //   },

  //   delete: async (id: string): Promise<void> => {
  //     await axiosInstance.delete(`${"/cars"}/${id}`);
  //   },
};

export default carApi;
