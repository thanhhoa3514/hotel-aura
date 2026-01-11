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

export interface PaymentError {
    code: string;
    message: string;
    details?: string;
}

enum PaymentErrorCode {
    RATE_LIMITED = 'PAYMENT_005',
    INVALID_AMOUNT = 'PAYMENT_003',
    STRIPE_ERROR = 'PAYMENT_004',
    SESSION_EXPIRED = 'PAYMENT_007',
    UNKNOWN = 'PAYMENT_000',
}

function parsePaymentError(error: unknown): PaymentError {
    if (typeof error === 'object' && error !== null && 'response' in error) {
        const axiosError = error as { response?: { data?: { errorCode?: string; message?: string; detail?: string } } };
        const data = axiosError.response?.data;
        if (data?.errorCode) {
            return {
                code: data.errorCode,
                message: data.message || 'Payment error occurred',
                details: data.detail,
            };
        }
    }
    return {
        code: PaymentErrorCode.UNKNOWN,
        message: error instanceof Error ? error.message : 'An unexpected payment error occurred',
    };
}

function isRateLimitError(error: PaymentError): boolean {
    return error.code === PaymentErrorCode.RATE_LIMITED;
}

function getRetryDelay(error: PaymentError): number | null {
    if (isRateLimitError(error)) {
        return 60000;
    }
    return null;
}

function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Payment Service - Handles Stripe payment-related API calls with retry logic
 */
export const paymentService = {
    maxRetries: 3,
    baseDelay: 1000,

    /**
     * Create a Stripe Checkout Session with automatic retry on rate limit
     */
    async createCheckoutSession(request: CheckoutSessionRequest, retryCount = 0): Promise<CheckoutSessionResponse> {
        try {
            const response = await apiClient.post<ApiResponse<CheckoutSessionResponse>>(
                '/api/payments/create-checkout-session',
                request
            );
            return response.data.data;
        } catch (error) {
            const paymentError = parsePaymentError(error);
            const retryDelay = getRetryDelay(paymentError);

            if (retryDelay !== null && retryCount < this.maxRetries) {
                console.warn(`Rate limited, retrying in ${retryDelay}ms (attempt ${retryCount + 1}/${this.maxRetries})`);
                await delay(retryDelay);
                return this.createCheckoutSession(request, retryCount + 1);
            }

            if (isRateLimitError(paymentError)) {
                throw new Error('Too many payment attempts. Please wait a minute and try again.');
            }

            throw new Error(paymentError.message || 'Failed to create payment session');
        }
    },

    /**
     * Validate payment request before submission
     */
    validatePaymentRequest(request: CheckoutSessionRequest): { valid: boolean; error?: string } {
        if (!request.reservationId) {
            return { valid: false, error: 'Reservation ID is required' };
        }
        if (!request.successUrl) {
            return { valid: false, error: 'Success URL is required' };
        }
        if (!request.cancelUrl) {
            return { valid: false, error: 'Cancel URL is required' };
        }
        return { valid: true };
    },

    /**
     * Check if error is a rate limit error
     */
    isRateLimitError,
};

export default paymentService;
