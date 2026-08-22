import { useCallback, useState } from "react";
import bookingApi from "../api/booking.api";
import type { Booking, CreateBookingPayload } from "../types/booking.types";

interface UseBookingResult {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  fetchBookings: () => Promise<void>;
  submitting: boolean;
  createError: string | null;
  createBooking: (payload: CreateBookingPayload) => Promise<Booking>;
}

export const useBooking = (userId?: string): UseBookingResult => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const all = await bookingApi.getAllBookings();
      setBookings(userId ? all.filter((b) => b.user_id === userId) : all);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Không thể tải danh sách đặt xe."
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const createBooking = useCallback(
    async (payload: CreateBookingPayload): Promise<Booking> => {
      try {
        setSubmitting(true);
        setCreateError(null);
        const booking = await bookingApi.createBooking(payload);
        return booking;
      } catch (err: any) {
        const message =
          err.response?.data?.message || "Không thể tạo đơn đặt xe.";
        setCreateError(message);
        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    []
  );

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    submitting,
    createError,
    createBooking,
  };
};
