import apiClient from '../apiClient';

export interface OTPResponse {
    success: boolean;
    message: string;
    email: string;
    expiresInSeconds: number;
    remainingAttempts: number;
    timestamp: string;
}

export interface VerificationResponse {
    success: boolean;
    verified: boolean;
    message: string;
    email: string;
    timestamp: string;
}

/**
 * Email Verification Service
 * 
 * Handles all email verification API calls
 */
class EmailVerificationService {
    /**
     * Send OTP to email
     */
    async sendOTP(email: string, fullName: string): Promise<OTPResponse> {
        const response = await apiClient.post('/email/send-otp', {
            email,
            fullName
        });
        return response.data.data;
    }

    /**
     * Verify OTP
     */
    async verifyOTP(email: string, otp: string): Promise<VerificationResponse> {
        const response = await apiClient.post('/email/verify-otp', {
            email,
            otp
        });
        return response.data.data;
    }

    /**
     * Resend OTP
     */
    async resendOTP(email: string): Promise<OTPResponse> {
        const response = await apiClient.post('/email/resend-otp', {
            email
        });
        return response.data.data;
    }

    /**
     * Check verification status
     */
    async checkStatus(email: string): Promise<boolean> {
        const response = await apiClient.get(`/email/status/${email}`);
        return response.data.data;
    }
}

export default new EmailVerificationService();
