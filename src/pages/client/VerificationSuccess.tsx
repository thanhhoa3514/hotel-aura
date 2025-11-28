import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function VerificationSuccess() {
    const navigate = useNavigate();
    const location = useLocation();
    const [countdown, setCountdown] = useState(5);

    const fullName = location.state?.fullName || 'User';

    useEffect(() => {
        // Countdown to redirect
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    navigate('/login');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-green-900 dark:to-indigo-900">
            {/* Confetti animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(50)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                            background: `hsl(${Math.random() * 360}, 70%, 60%)`,
                            left: `${Math.random() * 100}%`,
                            top: '-5%',
                        }}
                        animate={{
                            y: ['0vh', '110vh'],
                            x: [0, (Math.random() - 0.5) * 200],
                            rotate: [0, 360],
                            opacity: [1, 0.5, 0],
                        }}
                        transition={{
                            duration: 2 + Math.random() * 2,
                            delay: Math.random() * 0.5,
                            ease: 'easeIn',
                        }}
                    />
                ))}
            </div>

            {/* Main content */}
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                    className="w-full max-w-md"
                >
                    {/* Glass card */}
                    <div className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 md:p-12 text-center">
                        {/* Success icon with animation */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                delay: 0.2,
                                type: 'spring',
                                stiffness: 200,
                                damping: 10
                            }}
                            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 mb-6"
                        >
                            <CheckCircle2 className="w-14 h-14 text-white" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                                Xác thực thành công! 🎉
                            </h1>

                            <p className="text-gray-600 dark:text-gray-300 mb-2">
                                Xin chào <span className="font-semibold text-purple-600 dark:text-purple-400">{fullName}</span>!
                            </p>

                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                Email của bạn đã được xác thực. Bạn có thể đăng nhập để trải nghiệm đầy đủ các tính năng.
                            </p>

                            {/* Countdown */}
                            <div className="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-xl p-4 mb-6">
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    Tự động chuyển đến trang đăng nhập sau{' '}
                                    <span className="font-bold text-purple-600 dark:text-purple-400 text-lg">
                                        {countdown}
                                    </span>{' '}
                                    giây
                                </p>
                            </div>

                            {/* Login button */}
                            <Button
                                onClick={() => navigate('/login')}
                                className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 group"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    Đăng nhập ngay
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
