import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { XCircle, RefreshCcw, Home, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ClientNavbar } from "@/components/layout/ClientNavbar";

export default function PaymentCancel() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50/50 via-background to-orange-50/50 dark:from-red-950/20 dark:via-background dark:to-orange-950/20">
            <ClientNavbar currentPage="bookings" />

            <div className="container mx-auto px-6 py-16 max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <Card className="p-8 md:p-12 text-center relative overflow-hidden border-orange-200 dark:border-orange-800">
                        {/* Background decoration */}
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-100 dark:bg-orange-900/30 rounded-full blur-3xl" />
                            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-red-100 dark:bg-red-900/30 rounded-full blur-3xl" />
                        </div>

                        {/* Cancel Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="relative z-10 mb-6"
                        >
                            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30">
                                <XCircle className="h-12 w-12 text-white" />
                            </div>
                        </motion.div>

                        {/* Title */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="relative z-10"
                        >
                            <span className="text-sm font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wide">
                                Thanh toán đã hủy
                            </span>
                            <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
                                Đặt phòng chưa hoàn tất
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-md mx-auto">
                                Có vẻ như bạn đã hủy quá trình thanh toán. Đừng lo, đặt phòng của bạn vẫn được lưu và bạn có thể thử lại bất cứ lúc nào.
                            </p>
                        </motion.div>

                        {/* Info Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="relative z-10 mt-8 p-6 bg-muted/50 rounded-xl border border-border"
                        >
                            <div className="flex items-start gap-3 text-left">
                                <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-medium text-foreground mb-1">Tại sao thanh toán thất bại?</h3>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• Bạn đã đóng trang thanh toán trước khi hoàn tất</li>
                                        <li>• Thời gian phiên thanh toán đã hết hạn</li>
                                        <li>• Có sự cố với phương thức thanh toán của bạn</li>
                                    </ul>
                                </div>
                            </div>
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="relative z-10 mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <Button
                                onClick={() => navigate('/rooms')}
                                className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 gap-2"
                                size="lg"
                            >
                                <RefreshCcw className="h-4 w-4" />
                                Thử lại
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
                            Cần hỗ trợ? Liên hệ với chúng tôi qua{" "}
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
