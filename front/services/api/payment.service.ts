import { ConfirmPaymentResponse, CreatePaymentIntentRequest, PaymentResponse } from "@/types/payment.types";
import { apiClient } from "./axios.config";

export const PaymentServive={
    createPaymentIntent: async(data:CreatePaymentIntentRequest):Promise<PaymentResponse>=>{
        const response= await apiClient.post<PaymentResponse>('/payment/create-payment-intent',data);
        return response.data;
    },
    confirmPayment: async(data:ConfirmPaymentResponse):Promise<PaymentResponse>=>{
        const response= await apiClient.post<PaymentResponse>('/payment/confirm-payment',data);
        return response.data;
    }
}

export type {ConfirmPaymentResponse,CreatePaymentIntentRequest,PaymentResponse}