import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Wifi, Tv, Wind, Coffee, MapPin, Users, Maximize, ChevronLeft, Calendar, Star, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { BookingModal } from "@/components/booking/BookingModal";
import { roomService } from "@/services/roomService";
import { RoomResponse } from "@/types/api.types";
import { ClientNavbar } from "@/components/layout/ClientNavbar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Footer } from "./Footer";

// --- 1. Hàm Fix URL (Tái sử dụng) ---
const fixImageUrl = (url: string | undefined): string => {
  if (!url) return "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800";
  const match = url.match(/(https?:\/\/[^\s]+)/);
  if (match) return match[0];
  if (url.startsWith("/")) return `http://localhost:8080${url}`;
  return url;
};

const amenityIcons: Record<string, any> = {
  "WiFi": Wifi,
  "TV": Tv,
  "Air Conditioning": Wind,
  "Mini Bar": Coffee,
  "Kitchen": Coffee,
  "Balcony": MapPin,
  "Sea View": MapPin,
  "City View": MapPin,
  "Jacuzzi": Coffee,
};

const statusMap = {
  AVAILABLE: { label: "Có sẵn", variant: "default" as const },
  OCCUPIED: { label: "Đã đặt", variant: "secondary" as const },
  MAINTENANCE: { label: "Bảo trì", variant: "destructive" as const },
  CLEANING: { label: "Đang dọn", variant: "secondary" as const },
};

export default function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState<RoomResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchRoom();
    }
  }, [id]);

  const fetchRoom = async () => {
    try {
      setLoading(true);
      const data = await roomService.getRoomById(id!);
      setRoom(data);
    } catch (error) {
      console.error("Error fetching room:", error);
      toast.error("Không thể tải thông tin phòng");
      navigate("/rooms");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <div className="text-muted-foreground">Đang tải thông tin phòng...</div>
        </div>
      </div>
    );
  }

  if (!room) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ClientNavbar currentPage="rooms" onBookingClick={() => setIsBookingModalOpen(true)} />

      {/* Breadcrumb / Back Navigation */}
      <div className="container mx-auto px-6 py-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/rooms")}
          className="gap-2 hover:bg-secondary/50 pl-0"
        >
          <ChevronLeft className="h-4 w-4" />
          Quay lại danh sách phòng
        </Button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-20 flex-grow">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left Column: Images & Details (Chiếm 2 phần) */}
          <div className="lg:col-span-2 space-y-8">

            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl overflow-hidden shadow-lg border bg-card"
            >
              <Carousel className="w-full">
                <CarouselContent>
                  {(room.images && room.images.length > 0 ? room.images : [{ id: 'default', imageUrl: undefined }]).map((image, index) => (
                    <CarouselItem key={image.id || index}>
                      <div className="relative aspect-video">
                        <img
                          src={fixImageUrl(image.imageUrl)}
                          alt={`${room.roomType?.name} - Ảnh ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {/* Nút điều hướng đẹp hơn */}
                <CarouselPrevious className="left-4 bg-white/20 hover:bg-white/40 border-none text-white" />
                <CarouselNext className="right-4 bg-white/20 hover:bg-white/40 border-none text-white" />
              </Carousel>
            </motion.div>

            {/* Description & Policies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  Mô tả phòng
                </h2>
                <Card className="p-6 bg-secondary/10 border-none">
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {room.roomType?.description || "Không có mô tả chi tiết."}
                  </p>
                </Card>
              </div>

              {/* Amenities Grid */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Tiện nghi cao cấp</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {room.roomType?.amenities?.map((amenity: string) => {
                    const Icon = amenityIcons[amenity] || ShieldCheck;
                    return (
                      <div key={amenity} className="flex items-center gap-3 p-4 rounded-xl bg-card border shadow-sm hover:shadow-md transition-shadow">
                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="font-medium">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Policies */}
              <Card className="p-8 border-primary/20 bg-primary/5">
                <h2 className="text-2xl font-bold mb-6">Chính sách lưu trú</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary font-semibold">
                      <Calendar className="h-5 w-5" /> Nhận phòng
                    </div>
                    <p className="text-2xl font-bold">14:00</p>
                    <p className="text-sm text-muted-foreground">Vui lòng xuất trình ID/Hộ chiếu</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary font-semibold">
                      <Calendar className="h-5 w-5" /> Trả phòng
                    </div>
                    <p className="text-2xl font-bold">12:00</p>
                    <p className="text-sm text-muted-foreground">Trả phòng trễ có thể tính phí</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary font-semibold">
                      <ShieldCheck className="h-5 w-5" /> Hủy phòng
                    </div>
                    <p className="font-medium">Miễn phí trước 24h</p>
                    <p className="text-sm text-muted-foreground">Hoàn tiền 100% vào ví</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Right Column: Sticky Booking Card (Chiếm 1 phần) */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="sticky top-24" // --- GIÚP CARD LUÔN HIỂN THỊ KHI SCROLL ---
            >
              <Card className="p-6 shadow-xl border-t-4 border-t-primary">
                {/* Header Card */}
                <div className="mb-6">
                  <div className="flex justify-between items-start mb-2">
                    <h1 className="text-2xl font-bold">{room.roomType?.name}</h1>
                    <Badge variant={statusMap[room.roomStatus?.name as keyof typeof statusMap]?.variant || "default"}>
                      {statusMap[room.roomStatus?.name as keyof typeof statusMap]?.label || room.roomStatus?.name}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">Phòng số: <span className="font-mono font-bold text-foreground">{room.roomNumber}</span></p>
                </div>

                {/* Price */}
                <div className="mb-6 bg-secondary/30 p-4 rounded-lg flex justify-between items-end">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Giá mỗi đêm</p>
                    <span className="text-3xl font-bold text-primary">
                      {Number(room.roomType?.pricePerNight || 0).toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground flex items-center gap-2"><Users className="h-4 w-4" /> Sức chứa</span>
                    <span className="font-medium">{room.roomType?.capacity} người</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground flex items-center gap-2"><Maximize className="h-4 w-4" /> Diện tích</span>
                    <span className="font-medium">{room.roomType?.size} m²</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground flex items-center gap-2"><MapPin className="h-4 w-4" /> Vị trí</span>
                    <span className="font-medium">Tầng {room.floor}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <Button
                    onClick={() => setIsBookingModalOpen(true)}
                    // ...
                    // Sửa room.status thành room.roomStatus
                    disabled={room.roomStatus?.name !== "Available"}
                  >
                    {room.roomStatus?.name === "Available" ? "Đặt phòng ngay" : "Phòng không khả dụng"}
                  </Button>

                  <Button variant="outline" className="w-full" onClick={() => toast.success("Đã thêm vào danh sách yêu thích!")}>
                    Thêm vào yêu thích
                  </Button>
                </div>

                <div className="mt-6 text-center text-xs text-muted-foreground">
                  <p>Cam kết giá tốt nhất • Không phí ẩn</p>
                </div>
              </Card>
            </motion.div>
          </div>

        </div>
      </div>
      <Footer />

      {/* Booking Modal - Đảm bảo truyền ảnh đã fix URL */}
      <BookingModal
        open={isBookingModalOpen}
        onOpenChange={setIsBookingModalOpen}
        preSelectedRoom={room ? {
          id: room.id,
          roomNumber: room.roomNumber,
          roomType: room.roomType?.name || "",
          pricePerNight: Number(room.roomType?.pricePerNight) || 0,
          imageUrl: fixImageUrl(room.images?.[0]?.imageUrl), // Fix URL ở đây
        } : undefined}
      />
    </div>
  );
}