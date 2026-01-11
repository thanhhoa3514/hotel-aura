import apiClient from './apiClient';
import { ApiResponse } from '@/types/api.types';

export interface CheckoutSessionRequest {
    reservationId: string;
    successUrl: string;
    cancelUrl: string;
}

export interface CheckoutSessionResponse {
    sessionId: string;
    sessionUrl: string;
}

/**
 * Payment Service - Handles Stripe payment-related API calls
 */
export const paymentService = {
    /**
     * Create a Stripe Checkout Session for hosted payment page
     * After calling this, redirect the user to sessionUrl
     */
    async createCheckoutSession(request: CheckoutSessionRequest): Promise<CheckoutSessionResponse> {
        const response = await apiClient.post<ApiResponse<CheckoutSessionResponse>>(
            '/api/payments/create-checkout-session',
            request
        );
        return response.data.data;
    },
};

export default paymentService;
