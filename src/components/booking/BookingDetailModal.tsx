import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Users,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  Clock,
  FileText,
} from "lucide-react";

interface Booking {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  room_number: string;
  room_type: string;
  check_in_date: string;
  check_out_date: string;
  guests_count: number;
  total_price: number;
  status: string;
  special_requests: string | null;
  created_at: string;
  updated_at: string;
}

interface BookingDetailModalProps {
  booking: Booking;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
  confirmed: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  checked_in: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  checked_out: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
  cancelled: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
};

const statusLabels = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  checked_in: "Đã check-in",
  checked_out: "Đã check-out",
  cancelled: "Đã hủy",
};

export function BookingDetailModal({
  booking,
  open,
  onOpenChange,
}: BookingDetailModalProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const calculateNights = () => {
    const checkIn = new Date(booking.check_in_date);
    const checkOut = new Date(booking.check_out_date);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Chi tiết đặt phòng</DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Status Badge */}
          <div className="flex justify-center">
            <Badge
              className={`text-base px-6 py-2 ${
                statusColors[booking.status as keyof typeof statusColors]
              }`}
            >
              {statusLabels[booking.status as keyof typeof statusLabels]}
            </Badge>
          </div>

          <Separator />

          {/* Guest Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Thông tin khách hàng
            </h3>
            <div className="grid gap-3 pl-7">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Họ tên:</span>
                <span className="font-medium">{booking.guest_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground flex-1">Email:</span>
                <span className="font-medium">{booking.guest_email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground flex-1">Điện thoại:</span>
                <span className="font-medium">{booking.guest_phone}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Room Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Thông tin phòng
            </h3>
            <div className="grid gap-3 pl-7">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Số phòng:</span>
                <span className="font-medium text-lg">{booking.room_number}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Loại phòng:</span>
                <span className="font-medium">{booking.room_type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Số khách:</span>
                <span className="font-medium">{booking.guests_count} người</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Booking Dates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Thời gian lưu trú
            </h3>
            <div className="grid gap-3 pl-7">
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-sm">Check-in:</span>
                <span className="font-medium">{formatDate(booking.check_in_date)}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-sm">Check-out:</span>
                <span className="font-medium">{formatDate(booking.check_out_date)}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-muted-foreground">Số đêm:</span>
                <span className="font-semibold text-lg">{calculateNights()} đêm</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Thông tin thanh toán
            </h3>
            <div className="grid gap-3 pl-7">
              <div className="flex items-center justify-between text-lg">
                <span className="text-muted-foreground">Tổng tiền:</span>
                <span className="font-bold text-primary">
                  {formatCurrency(booking.total_price)}
                </span>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          {booking.special_requests && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Yêu cầu đặc biệt
                </h3>
                <div className="pl-7">
                  <p className="text-muted-foreground bg-muted/50 p-4 rounded-lg">
                    {booking.special_requests}
                  </p>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Timestamps */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Thông tin hệ thống
            </h3>
            <div className="grid gap-3 pl-7 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Ngày tạo:</span>
                <span className="font-medium">{formatDateTime(booking.created_at)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Cập nhật:</span>
                <span className="font-medium">{formatDateTime(booking.updated_at)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Mã đặt phòng:</span>
                <span className="font-mono text-xs">{booking.id}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
