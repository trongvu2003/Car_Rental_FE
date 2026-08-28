import axiosInstance from "./axios";
import type {
  CreatePaymentPayload,
  CreatePaymentResponse,
} from "../types/payment.types";

const paymentApi = {
  createPayment: async (
    data: CreatePaymentPayload
  ): Promise<CreatePaymentResponse> => {
    const response = await axiosInstance.post<CreatePaymentResponse>(
      "/payments",
      data
    );
    return response.data;
  },
};

export default paymentApi;
