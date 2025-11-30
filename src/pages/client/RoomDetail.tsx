import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Wifi, Tv, Wind, Coffee, MapPin, Users, Maximize, ChevronLeft, Calendar } from "lucide-react";
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
        <div className="animate-pulse text-xl">Đang tải...</div>
      </div>
    );
  }

  if (!room) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <ClientNavbar currentPage="rooms" onBookingClick={() => setIsBookingModalOpen(true)} />

      {/* Back Button */}
      <div className="container mx-auto px-6 py-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/rooms")}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Quay lại danh sách phòng
        </Button>
      </div>

      {/* Room Detail Content */}
      <div className="container mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="relative rounded-2xl overflow-hidden">
              {room.images && room.images.length > 0 ? (
                <Carousel className="w-full">
                  <CarouselContent>
                    {room.images.map((image, index) => (
                      <CarouselItem key={image.id}>
                        <div className="relative h-[500px]">
                          <img
                            src={image.imageUrl}
                            alt={`${room.roomType.name} - Ảnh ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-4" />
                  <CarouselNext className="right-4" />
                </Carousel>
              ) : (
                <div className="relative h-[500px]">
                  <img
                    src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800"
                    alt={room.roomType.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="absolute top-4 right-4 z-10">
                <Badge variant={statusMap[room.status.name as keyof typeof statusMap]?.variant || "default"} className="text-base px-4 py-2">
                  {statusMap[room.status.name as keyof typeof statusMap]?.label || room.status.name}
                </Badge>
              </div>
            </div>
          </motion.div>

          {/* Room Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-4xl font-bold mb-2">{room.roomType.name}</h1>
              <p className="text-xl text-muted-foreground">Phòng số {room.roomNumber}</p>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-primary">
                {Number(room.roomType.pricePerNight).toLocaleString('vi-VN')}đ
              </span>
              <span className="text-xl text-muted-foreground">/ đêm</span>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-semibold mb-4">Mô tả</h2>
              <p className="text-muted-foreground leading-relaxed">
                {room.roomType.description || "Phòng được thiết kế hiện đại, thoải mái với đầy đủ tiện nghi."}
              </p>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-semibold mb-4">Thông tin phòng</h2>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Tầng</p>
                    <p className="font-semibold">{room.floor}</p>
                  </div>
                </Card>

                <Card className="p-4 flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Sức chứa</p>
                    <p className="font-semibold">{room.roomType.capacity} người</p>
                  </div>
                </Card>

                <Card className="p-4 flex items-center gap-3">
                  <Maximize className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Diện tích</p>
                    <p className="font-semibold">{room.roomType.size} m²</p>
                  </div>
                </Card>

                <Card className="p-4 flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Trạng thái</p>
                    <p className="font-semibold">{statusMap[room.status.name as keyof typeof statusMap]?.label}</p>
                  </div>
                </Card>
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-semibold mb-4">Tiện nghi</h2>
              <div className="grid grid-cols-2 gap-3">
                {room.roomType.amenities?.map((amenity: string) => {
                  const Icon = amenityIcons[amenity] || Coffee;
                  return (
                    <div key={amenity} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Icon className="h-5 w-5 text-primary" />
                      <span>{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Button
                onClick={() => setIsBookingModalOpen(true)}
                size="lg"
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg py-6"
                disabled={room.status.name !== "AVAILABLE"}
              >
                {room.status.name === "AVAILABLE" ? "Đặt phòng ngay" : "Phòng không khả dụng"}
              </Button>

              <Button
                onClick={() => navigate("/rooms")}
                variant="outline"
                size="lg"
                className="w-full text-lg py-6"
              >
                Xem phòng khác
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16"
        >
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-6">Chính sách phòng</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Nhận phòng
                </h3>
                <p className="text-muted-foreground">Từ 14:00</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Trả phòng
                </h3>
                <p className="text-muted-foreground">Trước 12:00</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Hủy phòng
                </h3>
                <p className="text-muted-foreground">Miễn phí trước 24h</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
      <Footer />

      {/* Booking Modal */}
      <BookingModal
        open={isBookingModalOpen}
        onOpenChange={setIsBookingModalOpen}
        preSelectedRoom={room ? {
          id: room.id,
          roomNumber: room.roomNumber,
          roomType: room.roomType.name,
          pricePerNight: Number(room.roomType.pricePerNight) || 150,
          imageUrl: room.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800",
        } : undefined}
      />
    </div>
  );
}