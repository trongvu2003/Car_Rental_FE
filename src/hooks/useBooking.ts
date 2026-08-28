import { useCallback, useState } from "react";
import bookingApi from "../api/booking.api";
import type { Booking, CreateBookingPayload } from "../types/booking.types";

interface UseBookingResult {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  fetchMyBookings: () => Promise<void>;
  fetchBookings: () => Promise<void>;
  submitting: boolean;
  createError: string | null;
  createBooking: (payload: CreateBookingPayload) => Promise<Booking>;
  deleting: boolean;
  deleteError: string | null;
  deleteBooking: (id: string) => Promise<void>;
  deleteMultipleBookings: (ids: string[]) => Promise<void>;
}

export const useBooking = (userId?: string): UseBookingResult => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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

  const fetchMyBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const myBookingsList = await bookingApi.getMyBookings();
      setBookings(myBookingsList);
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tải lịch sử đặt xe.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Xóa 1 booking - cập nhật state ngay, không cần fetch lại
  const deleteBooking = useCallback(async (id: string) => {
    try {
      setDeleting(true);
      setDeleteError(null);
      await bookingApi.deleteBooking(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err: any) {
      setDeleteError(
        err.response?.data?.message || "Không thể xóa đơn đặt xe."
      );
      throw err;
    } finally {
      setDeleting(false);
    }
  }, []);

  const deleteMultipleBookings = useCallback(async (ids: string[]) => {
    if (ids.length === 0) return;
    try {
      setDeleting(true);
      setDeleteError(null);
      await bookingApi.deleteMultipleBookings(ids);
      setBookings((prev) => prev.filter((b) => !ids.includes(b.id)));
    } catch (err: any) {
      setDeleteError(
        err.response?.data?.message || "Không thể xóa các đơn đã chọn."
      );
      throw err;
    } finally {
      setDeleting(false);
    }
  }, []);

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    submitting,
    createError,
    createBooking,
    fetchMyBookings,
    deleting,
    deleteError,
    deleteBooking,
    deleteMultipleBookings,
  };
};
