import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Wifi, Tv, Wind, Coffee, MapPin, Users, Maximize, ChevronLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BookingModal } from "@/components/booking/BookingModal";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
  available: { label: "Có sẵn", variant: "default" as const },
  occupied: { label: "Đã đặt", variant: "secondary" as const },
  maintenance: { label: "Bảo trì", variant: "destructive" as const },
};

export default function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState<any>(null);
  const [roomImages, setRoomImages] = useState<any[]>([]);
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
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setRoom(data);
      
      // Fetch room images
      const { data: imagesData, error: imagesError } = await supabase
        .from("room_images")
        .select("*")
        .eq("room_id", id)
        .order("display_order", { ascending: true });

      if (!imagesError && imagesData) {
        setRoomImages(imagesData);
      }
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
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 backdrop-blur-md bg-card/80 border-b"
      >
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
              <span className="text-lg font-bold text-white">HP</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              HotelPro
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => navigate("/")} className="text-foreground/80 hover:text-foreground transition-colors">
              Trang chủ
            </button>
            <button onClick={() => navigate("/rooms")} className="text-foreground font-semibold transition-colors">
              Phòng
            </button>
          </nav>

          <Button onClick={() => setIsBookingModalOpen(true)} className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
            Đặt phòng ngay
          </Button>
        </div>
      </motion.header>

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
              {roomImages.length > 0 ? (
                <Carousel className="w-full">
                  <CarouselContent>
                    {roomImages.map((image, index) => (
                      <CarouselItem key={image.id}>
                        <div className="relative h-[500px]">
                          <img
                            src={image.image_url}
                            alt={`${room.room_type} - Ảnh ${index + 1}`}
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
                    src={room.image_url || "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800"}
                    alt={room.room_type}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="absolute top-4 right-4 z-10">
                <Badge variant={statusMap[room.status as keyof typeof statusMap]?.variant || "default"} className="text-base px-4 py-2">
                  {statusMap[room.status as keyof typeof statusMap]?.label || room.status}
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
              <h1 className="text-4xl font-bold mb-2">{room.room_type}</h1>
              <p className="text-xl text-muted-foreground">Phòng số {room.room_number}</p>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-primary">
                {Number(room.price).toLocaleString('vi-VN')}đ
              </span>
              <span className="text-xl text-muted-foreground">/ đêm</span>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-semibold mb-4">Mô tả</h2>
              <p className="text-muted-foreground leading-relaxed">
                {room.description || "Phòng được thiết kế hiện đại, thoải mái với đầy đủ tiện nghi."}
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
                    <p className="font-semibold">{room.capacity} người</p>
                  </div>
                </Card>
                
                <Card className="p-4 flex items-center gap-3">
                  <Maximize className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Diện tích</p>
                    <p className="font-semibold">{room.size} m²</p>
                  </div>
                </Card>
                
                <Card className="p-4 flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Trạng thái</p>
                    <p className="font-semibold">{statusMap[room.status as keyof typeof statusMap]?.label}</p>
                  </div>
                </Card>
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="text-2xl font-semibold mb-4">Tiện nghi</h2>
              <div className="grid grid-cols-2 gap-3">
                {room.amenities?.map((amenity: string) => {
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
                disabled={room.status !== "available"}
              >
                {room.status === "available" ? "Đặt phòng ngay" : "Phòng không khả dụng"}
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

      {/* Footer */}
      <footer className="bg-card border-t py-12 px-6">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2025 HotelPro — All rights reserved.</p>
        </div>
      </footer>

      {/* Booking Modal */}
      <BookingModal open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen} />
    </div>
  );
}