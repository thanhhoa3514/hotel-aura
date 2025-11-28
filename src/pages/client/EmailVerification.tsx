import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OTPInput } from '@/components/email/OTPInput';
import { ResendTimer } from '@/components/email/ResendTimer';
import { toast } from 'sonner';
import emailVerificationService from '@/services/email/emailVerificationService';

export default function EmailVerification() {
    const navigate = useNavigate();
    const location = useLocation();

    // Get email and fullName from location state (passed from Register page)
    const email = location.state?.email;
    const fullName = location.state?.fullName || 'User';

    const [otp, setOtp] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [expirationTime, setExpirationTime] = useState(300); // 5 minutes in seconds
    const [remainingAttempts, setRemainingAttempts] = useState(3);

    useEffect(() => {
        // Redirect if no email provided
        if (!email) {
            toast.error('Email không hợp lệ');
            navigate('/register');
        }
    }, [email, navigate]);

    const handleOTPComplete = async (completedOtp: string) => {
        setOtp(completedOtp);
        await verifyOTP(completedOtp);
    };

    const verifyOTP = async (otpCode: string) => {
        try {
            setIsVerifying(true);

            const response = await emailVerificationService.verifyOTP(email, otpCode);

            if (response.verified) {
                toast.success('Email đã được xác thực thành công!');
                // Redirect to success page
                navigate('/verification-success', {
                    state: { email, fullName }
                });
            } else {
                toast.error(response.message);
                setOtp(''); // Clear OTP
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Mã OTP không hợp lệ';
            toast.error(errorMessage);

            // Update remaining attempts
            if (error.response?.data?.data?.remainingAttempts !== undefined) {
                setRemainingAttempts(error.response.data.data.remainingAttempts);
            }

            setOtp(''); // Clear OTP on error
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResend = async () => {
        try {
            setIsResending(true);

            const response = await emailVerificationService.resendOTP(email);

            if (response.success) {
                toast.success(response.message);
                setExpirationTime(response.expiresInSeconds);
                setRemainingAttempts(response.remainingAttempts);
                setOtp(''); // Clear current OTP
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Không thể gửi lại mã OTP';
            toast.error(errorMessage);
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-purple-400/30 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            {/* Main content */}
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    {/* Glass card */}
                    <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 md:p-10">
                        {/* Logo & Title */}
                        <div className="text-center mb-8">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', duration: 0.6 }}
                                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4"
                            >
                                <Mail className="w-8 h-8 text-white" />
                            </motion.div>

                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Xác thực Email
                            </h1>

                            <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
                                Chúng tôi đã gửi mã OTP đến email
                            </p>
                            <p className="text-purple-600 dark:text-purple-400 font-medium mt-1">
                                {email}
                            </p>
                        </div>

                        {/* OTP Input */}
                        <div className="mb-6">
                            <OTPInput
                                length={6}
                                onComplete={handleOTPComplete}
                                disabled={isVerifying}
                            />
                        </div>

                        {/* Info box */}
                        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5">
                                    <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="text-sm text-gray-700 dark:text-gray-300">
                                    <p className="font-medium mb-1">Nhập mã OTP gồm 6 chữ số</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        Số lần thử còn lại: <span className="font-semibold">{remainingAttempts}</span>/3
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Resend timer */}
                        <div className="mb-6">
                            <ResendTimer
                                initialSeconds={60}
                                onResend={handleResend}
                                disabled={isResending}
                            />
                        </div>

                        {/* Verify button */}
                        <Button
                            onClick={() => otp.length === 6 && verifyOTP(otp)}
                            disabled={otp.length !== 6 || isVerifying}
                            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            {isVerifying ? 'Đang xác thực...' : 'Xác thực'}
                        </Button>

                        {/* Back to login */}
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full mt-4 flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-sm"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Quay lại đăng nhập
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
