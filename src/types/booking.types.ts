import type { Car } from "./car.types";
import type { User } from "./user.types";

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export type PaymentStatus = "pending" | "paid" | "failed";

export interface CreateBookingPayload {
  user_id: string;
  car_id: string;
  start_date: string;
  end_date: string;
}

export interface Booking {
  id: string;
  user_id: string;
  car_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: BookingStatus;
  payment_status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  car?: Car;
  user?: User;
}
