import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, Calendar, MapPin, Home, ArrowRight, Sparkles, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ClientNavbar } from "@/components/layout/ClientNavbar";

export default function PaymentSuccess() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-background to-blue-50/50 dark:from-green-950/20 dark:via-background dark:to-blue-950/20">
            <ClientNavbar currentPage="bookings" />

            <div className="container mx-auto px-6 py-16 max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <Card className="p-8 md:p-12 text-center relative overflow-hidden border-green-200 dark:border-green-800">
                        {/* Background decoration */}
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-green-100 dark:bg-green-900/30 rounded-full blur-3xl" />
                            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-100 dark:bg-blue-900/30 rounded-full blur-3xl" />
                        </div>

                        {/* Success Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="relative z-10 mb-6"
                        >
                            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                                <CheckCircle2 className="h-12 w-12 text-white" />
                            </div>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="absolute top-0 right-1/3"
                            >
                                <PartyPopper className="h-8 w-8 text-yellow-500" />
                            </motion.div>
                        </motion.div>

                        {/* Title */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="relative z-10"
                        >
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Sparkles className="h-5 w-5 text-yellow-500" />
                                <span className="text-sm font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">
                                    Thanh toán thành công
                                </span>
                                <Sparkles className="h-5 w-5 text-yellow-500" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                Cảm ơn bạn đã đặt phòng!
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-md mx-auto">
                                Đặt phòng của bạn đã được xác nhận. Chúng tôi đã gửi email xác nhận với tất cả chi tiết đặt phòng.
                            </p>
                        </motion.div>

                        {/* Booking Details Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="relative z-10 mt-8 p-6 bg-muted/50 rounded-xl border border-border"
                        >
                            <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    <span>Xác nhận đã được gửi qua email</span>
                                </div>
                                <div className="hidden md:block w-px h-4 bg-border" />
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    <span>HotelPro, Việt Nam</span>
                                </div>
                            </div>

                            {sessionId && (
                                <div className="mt-4 pt-4 border-t border-border">
                                    <p className="text-xs text-muted-foreground">
                                        Mã giao dịch: <span className="font-mono text-foreground">{sessionId.substring(0, 20)}...</span>
                                    </p>
                                </div>
                            )}
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="relative z-10 mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <Button
                                onClick={() => navigate('/my-bookings')}
                                className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 gap-2"
                                size="lg"
                            >
                                Xem đặt phòng của tôi
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                            <Button
                                onClick={() => navigate('/')}
                                variant="outline"
                                className="w-full sm:w-auto gap-2"
                                size="lg"
                            >
                                <Home className="h-4 w-4" />
                                Về trang chủ
                            </Button>
                        </motion.div>

                        {/* Support Info */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="relative z-10 mt-8 text-xs text-muted-foreground"
                        >
                            Có câu hỏi? Liên hệ với chúng tôi qua{" "}
                            <a href="mailto:support@hotelpro.vn" className="text-primary hover:underline">
                                support@hotelpro.vn
                            </a>
                        </motion.p>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
