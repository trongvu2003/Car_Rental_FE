import { useState } from "react";
import paymentApi from "../api/payment.api";
import type {
  CreatePaymentPayload,
  PaymentResult,
} from "../types/payment.types";

interface UsePaymentReturn {
  submitting: boolean;
  error: string | null;
  pay: (payload: CreatePaymentPayload) => Promise<PaymentResult | null>;
  resetError: () => void;
}

const usePayment = (): UsePaymentReturn => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pay = async (
    payload: CreatePaymentPayload
  ): Promise<PaymentResult | null> => {
    try {
      setSubmitting(true);
      setError(null);

      const response = await paymentApi.createPayment(payload);

      if (!response.success) {
        throw new Error("Tạo thanh toán thất bại.");
      }

      return response.data;
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Không thể khởi tạo thanh toán, vui lòng thử lại."
      );
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  const resetError = () => setError(null);

  return { submitting, error, pay, resetError };
};

export default usePayment;
