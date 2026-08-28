export type PaymentMethod = "cash" | "momo" | "vnpay";

export interface CreatePaymentData {
  booking_id: string;
  payment_method: PaymentMethod;
}

// Payload BE nhận vào — tránh trùng tên với DataTypes ở model, đặt Payload
export interface CreatePaymentPayload {
  booking_id: string;
  payment_method: PaymentMethod;
}

// vnpay/momo -> có payment_url; cash -> trả object Payment đã paid, không có payment_url
export interface PaymentResult {
  payment_url?: string;
  id?: string;
  booking_id?: string;
  amount?: number;
  payment_status?: "pending" | "paid" | "failed";
  payment_method?: PaymentMethod;
}

export interface CreatePaymentResponse {
  success: boolean;
  data: PaymentResult;
}
