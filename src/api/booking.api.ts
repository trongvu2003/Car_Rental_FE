import axiosInstance from "./axios";
import type {
  Booking,
  BookingStatus,
  CreateBookingPayload,
} from "../types/booking.types";

const bookingApi = {
  createBooking: async (payload: CreateBookingPayload): Promise<Booking> => {
    const response = await axiosInstance.post<Booking>("/bookings", payload);
    return response.data;
  },

  getBookingById: async (id: string): Promise<Booking> => {
    const response = await axiosInstance.get<Booking>(`/bookings/${id}`);
    return response.data;
  },

  getAllBookings: async (): Promise<Booking[]> => {
    const response = await axiosInstance.get<Booking[]>("/bookings");
    return response.data;
  },
  getMyBookings: async (): Promise<Booking[]> => {
    const response = await axiosInstance.get("/bookings/my-bookings");
    return response.data.data || response.data;
  },

  updateBookingStatus: async (
    id: string,
    status: BookingStatus
  ): Promise<Booking> => {
    const response = await axiosInstance.put<Booking>(
      `/bookings/${id}/status`,
      { status }
    );
    return response.data;
  },

  deleteBooking: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/bookings/${id}`);
  },
  deleteMultipleBookings: async (ids: string[]): Promise<void> => {
    await Promise.all(ids.map((id) => axiosInstance.delete(`/bookings/${id}`)));
  },
};

export default bookingApi;
