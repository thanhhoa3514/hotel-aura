import { motion } from "framer-motion";
import { ClientNavbar } from "@/components/layout/ClientNavbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Lock, Globe, Moon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function Settings() {
    return (
        <div className="min-h-screen bg-background">
            <ClientNavbar />

            <div className="container mx-auto px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto space-y-8"
                >
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Cài đặt</h1>
                        <p className="text-muted-foreground">Tùy chỉnh trải nghiệm của bạn</p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5" />
                                Thông báo
                            </CardTitle>
                            <CardDescription>Quản lý cách bạn nhận thông báo</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="email-notifications" className="flex flex-col gap-1">
                                    <span>Thông báo qua Email</span>
                                    <span className="text-sm text-muted-foreground font-normal">
                                        Nhận thông báo về đặt phòng qua email
                                    </span>
                                </Label>
                                <Switch id="email-notifications" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="booking-reminders" className="flex flex-col gap-1">
                                    <span>Nhắc nhở đặt phòng</span>
                                    <span className="text-sm text-muted-foreground font-normal">
                                        Nhận nhắc nhở trước khi check-in
                                    </span>
                                </Label>
                                <Switch id="booking-reminders" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="promotions" className="flex flex-col gap-1">
                                    <span>Khuyến mãi</span>
                                    <span className="text-sm text-muted-foreground font-normal">
                                        Nhận thông tin về ưu đãi và khuyến mãi
                                    </span>
                                </Label>
                                <Switch id="promotions" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Moon className="h-5 w-5" />
                                Giao diện
                            </CardTitle>
                            <CardDescription>Tùy chỉnh giao diện ứng dụng</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="dark-mode" className="flex flex-col gap-1">
                                    <span>Chế độ tối</span>
                                    <span className="text-sm text-muted-foreground font-normal">
                                        Bật chế độ tối cho giao diện
                                    </span>
                                </Label>
                                <Switch id="dark-mode" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5" />
                                Ngôn ngữ
                            </CardTitle>
                            <CardDescription>Chọn ngôn ngữ hiển thị</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Hiện tại: Tiếng Việt (Tính năng đang phát triển)
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lock className="h-5 w-5" />
                                Quyền riêng tư
                            </CardTitle>
                            <CardDescription>Quản lý quyền riêng tư của bạn</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="data-sharing" className="flex flex-col gap-1">
                                    <span>Chia sẻ dữ liệu</span>
                                    <span className="text-sm text-muted-foreground font-normal">
                                        Cho phép chia sẻ dữ liệu để cải thiện trải nghiệm
                                    </span>
                                </Label>
                                <Switch id="data-sharing" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}

