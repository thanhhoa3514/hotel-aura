import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ClientNavbar } from "@/components/layout/ClientNavbar";
import { useAuth } from "@/contexts/AuthContext";
import { reservationService } from "@/services/reservationService";
import { ReservationResponse } from "@/types";
import { getReservationStatusInfo } from "@/utils/reservationStatus";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Users, DollarSign, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function MyBookings() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<ReservationResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        fetchBookings();
    }, [isAuthenticated, user]);

    const fetchBookings = async () => {
        if (!user?.keycloakUserId) return;

        try {
            setLoading(true);
            setError(null);
            const response = await reservationService.getReservationsByGuestId(user.keycloakUserId);
            setBookings(response.data || []);
        } catch (err: any) {
            setError(err.message || "Không thể tải danh sách đặt phòng");
            toast.error("Không thể tải danh sách đặt phòng");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (reservationId: string) => {
        if (!confirm("Bạn có chắc chắn muốn hủy đặt phòng này?")) return;

        try {
            await reservationService.cancelReservation(reservationId);
            toast.success("Hủy đặt phòng thành công");
            fetchBookings();
        } catch (err: any) {
            toast.error(err.message || "Không thể hủy đặt phòng");
        }
    };

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
    };

    const calculateNights = (checkIn: string, checkOut: string) => {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <ClientNavbar currentPage="bookings" />
                <div className="container mx-auto px-6 py-12">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background">
                <ClientNavbar currentPage="bookings" />
                <div className="container mx-auto px-6 py-12">
                    <div className="flex flex-col items-center justify-center h-64 gap-4">
                        <AlertCircle className="h-12 w-12 text-destructive" />
                        <p className="text-lg text-muted-foreground">{error}</p>
                        <Button onClick={fetchBookings}>Thử lại</Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <ClientNavbar currentPage="bookings" />

            <div className="container mx-auto px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Đặt phòng của tôi</h1>
                        <p className="text-muted-foreground">
                            Quản lý tất cả các đặt phòng của bạn tại đây
                        </p>
                    </div>

                    {bookings.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
                                <h3 className="text-xl font-semibold mb-2">Chưa có đặt phòng nào</h3>
                                <p className="text-muted-foreground mb-6">
                                    Bạn chưa có đặt phòng nào. Hãy khám phá các phòng của chúng tôi!
                                </p>
                                <Button onClick={() => navigate("/rooms")}>Xem phòng</Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-6">
                            {bookings.map((booking) => {
                                const statusInfo = getReservationStatusInfo(booking.status);
                                const nights = calculateNights(booking.checkIn, booking.checkOut);

                                return (
                                    <motion.div
                                        key={booking.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <Card className="hover:shadow-lg transition-shadow">
                                            <CardHeader>
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <CardTitle className="flex items-center gap-2">
                                                            Đặt phòng #{booking.id.slice(0, 8)}
                                                            <Badge variant={statusInfo.variant}>
                                                                {statusInfo.label}
                                                            </Badge>
                                                        </CardTitle>
                                                        <CardDescription>
                                                            Đặt lúc: {formatDate(booking.createdAt)}
                                                        </CardDescription>
                                                    </div>
                                                    {(booking.status === "PENDING" ||
                                                        booking.status === "CONFIRMED") && (
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => handleCancelBooking(booking.id)}
                                                            >
                                                                Hủy đặt phòng
                                                            </Button>
                                                        )}
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div className="space-y-4">
                                                        <div className="flex items-start gap-3">
                                                            <Calendar className="h-5 w-5 text-primary mt-0.5" />
                                                            <div>
                                                                <div className="font-semibold">Ngày nhận phòng</div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    {formatDate(booking.checkIn)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-3">
                                                            <Calendar className="h-5 w-5 text-primary mt-0.5" />
                                                            <div>
                                                                <div className="font-semibold">Ngày trả phòng</div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    {formatDate(booking.checkOut)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-3">
                                                            <Clock className="h-5 w-5 text-primary mt-0.5" />
                                                            <div>
                                                                <div className="font-semibold">Số đêm</div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    {nights} đêm
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div className="flex items-start gap-3">
                                                            <MapPin className="h-5 w-5 text-primary mt-0.5" />
                                                            <div>
                                                                <div className="font-semibold">Phòng</div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    {booking.rooms.map((r) => r.roomNumber).join(", ")}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-3">
                                                            <Users className="h-5 w-5 text-primary mt-0.5" />
                                                            <div>
                                                                <div className="font-semibold">Số khách</div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    {booking.numberOfGuests} người
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-start gap-3">
                                                            <DollarSign className="h-5 w-5 text-primary mt-0.5" />
                                                            <div>
                                                                <div className="font-semibold">Tổng tiền</div>
                                                                <div className="text-lg font-bold text-primary">
                                                                    {booking.totalAmount.toLocaleString("vi-VN")} VNĐ
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {booking.specialRequests && (
                                                    <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                                                        <div className="font-semibold mb-1">Yêu cầu đặc biệt</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {booking.specialRequests}
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}

