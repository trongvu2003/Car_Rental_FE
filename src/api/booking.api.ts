import axiosInstance from "./axios";
import type { Booking, CreateBookingPayload } from "../types/booking.types";

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
};

export default bookingApi;
