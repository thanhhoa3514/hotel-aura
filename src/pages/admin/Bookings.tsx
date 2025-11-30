import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  Phone,
  Mail,
  Eye,
  Trash2,
  Filter,
  Search,
  Download,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BookingDetailModal } from "@/components/booking/BookingDetailModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
  confirmed: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  checked_in: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
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

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("pending");

  // Fetch bookings from database
  const fetchBookings = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách đặt phòng",
        variant: "destructive",
      });
    } else {
      setBookings(data || []);
      setFilteredBookings(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBookings();

    // Setup realtime listener for new bookings
    const channel = supabase
      .channel("bookings-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bookings",
        },
        (payload) => {
          const newBooking = payload.new as Booking;

          // Add new booking to the list
          setBookings((prev) => [newBooking, ...prev]);
          setFilteredBookings((prev) => [newBooking, ...prev]);

          // Show toast notification
          toast({
            title: "🎉 Đặt phòng mới!",
            description: `${newBooking.guest_name} đã đặt phòng ${newBooking.room_number} - ${newBooking.room_type}`,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Filter bookings based on search and active tab
  useEffect(() => {
    let filtered = bookings;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.guest_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.room_number.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply tab filter
    if (activeTab !== "all") {
      filtered = filtered.filter((booking) => booking.status === activeTab);
    }

    setFilteredBookings(filtered);
  }, [searchTerm, activeTab, bookings]);

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status: newStatus })
      .eq("id", bookingId);

    if (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật trạng thái",
        variant: "destructive",
      });
    } else {
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );
      toast({
        title: "Thành công",
        description: "Đã cập nhật trạng thái đặt phòng",
      });
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", bookingId);

    if (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa đặt phòng",
        variant: "destructive",
      });
    } else {
      setBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
      toast({
        title: "Thành công",
        description: "Đã xóa đặt phòng",
      });
    }
  };

  const handleViewDetail = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý đặt phòng</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý và theo dõi tất cả các đặt phòng
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchBookings}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Xuất Excel
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 border-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tổng đặt phòng</p>
              <p className="text-2xl font-bold">{bookings.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4 border-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Chờ xác nhận</p>
              <p className="text-2xl font-bold">
                {bookings.filter((b) => b.status === "pending").length}
              </p>
            </div>
            <Users className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-4 border-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Đã xác nhận</p>
              <p className="text-2xl font-bold">
                {bookings.filter((b) => b.status === "confirmed").length}
              </p>
            </div>
            <Users className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4 border-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Đã check-in</p>
              <p className="text-2xl font-bold">
                {bookings.filter((b) => b.status === "checked_in").length}
              </p>
            </div>
            <Users className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Search Filter */}
      <Card className="p-4 border-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên, email, phòng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Tabs for Booking Status */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="pending">
            Chờ xác nhận ({bookings.filter((b) => b.status === "pending").length})
          </TabsTrigger>
          <TabsTrigger value="confirmed">
            Chờ check-in ({bookings.filter((b) => b.status === "confirmed").length})
          </TabsTrigger>
          <TabsTrigger value="checked_in">
            Đã check-in ({bookings.filter((b) => b.status === "checked_in").length})
          </TabsTrigger>
          <TabsTrigger value="checked_out">
            Đã check-out ({bookings.filter((b) => b.status === "checked_out").length})
          </TabsTrigger>
          <TabsTrigger value="all">
            Tất cả ({bookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card className="border-2 rounded-2xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Liên hệ</TableHead>
                  <TableHead>Phòng</TableHead>
                  <TableHead>Ngày check-in</TableHead>
                  <TableHead>Ngày check-out</TableHead>
                  <TableHead>Số khách</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12">
                      <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                      <p className="text-muted-foreground">Đang tải dữ liệu...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12">
                      <Calendar className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-muted-foreground">Chưa có đặt phòng nào</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings.map((booking, index) => (
                    <motion.tr
                      key={booking.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 cursor-pointer"
                      onClick={() => handleViewDetail(booking)}
                    >
                      <TableCell className="font-medium">
                        <div>
                          <p className="font-semibold group-hover:text-primary transition-colors">
                            {booking.guest_name}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span className="truncate max-w-[150px]">{booking.guest_email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {booking.guest_phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-semibold">{booking.room_number}</p>
                          <p className="text-sm text-muted-foreground">{booking.room_type}</p>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(booking.check_in_date)}</TableCell>
                      <TableCell>{formatDate(booking.check_out_date)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {booking.guests_count}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(booking.total_price)}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Select
                          value={booking.status}
                          onValueChange={(value) => handleStatusChange(booking.id, value)}
                        >
                          <SelectTrigger className="w-[140px]">
                            <Badge className={statusColors[booking.status as keyof typeof statusColors]}>
                              {statusLabels[booking.status as keyof typeof statusLabels]}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Chờ xác nhận</SelectItem>
                            <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                            <SelectItem value="checked_in">Đã check-in</SelectItem>
                            <SelectItem value="checked_out">Đã check-out</SelectItem>
                            <SelectItem value="cancelled">Đã hủy</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetail(booking)}
                            className="hover:bg-primary/10"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteBooking(booking.id)}
                            className="hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail Modal */}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          open={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
        />
      )}
    </div>
  );
};

export default Bookings;
