import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Wifi, Tv, Wind, Coffee, Eye, MapPin, Users, Maximize, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { roomService } from "@/services/roomService";
import { RoomResponse } from "@/types/api.types";
import { Footer } from "./Footer";
import { ClientNavbar } from "@/components/layout/ClientNavbar";
import { RoomImageSlider } from "./RoomImageSlider";

const amenityIcons: Record<string, any> = {
  "WiFi": Wifi,
  "TV": Tv,
  "Air Conditioning": Wind,
  "Mini Bar": Coffee,
  "Kitchen": Coffee,
  "Balcony": Eye,
  "Sea View": Eye,
  "City View": Eye,
  "Jacuzzi": Coffee,
};

export default function ClientRooms() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("price-asc");

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const data = await roomService.getAllRooms();
      console.log(data);
      setRooms(data || []);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error("Không thể tải danh sách phòng");
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = rooms
    .filter((room) => {
      const matchesSearch =
        room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.roomType?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.roomType?.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filterType === "all" || room.roomType?.name?.toLowerCase() === filterType.toLowerCase();

      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return Number(a.roomType?.pricePerNight || 0) - Number(b.roomType?.pricePerNight || 0);
        case "price-desc":
          return Number(b.roomType?.pricePerNight || 0) - Number(a.roomType?.pricePerNight || 0);
        case "capacity-asc":
          return (a.roomType?.capacity || 0) - (b.roomType?.capacity || 0);
        case "capacity-desc":
          return (b.roomType?.capacity || 0) - (a.roomType?.capacity || 0);
        default:
          return 0;
      }
    });

  const roomTypes = Array.from(new Set(rooms.map(room => room.roomType?.name).filter(Boolean)));

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <ClientNavbar currentPage="rooms" onBookingClick={() => navigate("/")} />

      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80"
            alt="Hotel Rooms"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-6"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-foreground">
            Khám phá các phòng của chúng tôi
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Chọn phòng hoàn hảo cho kỳ nghỉ của bạn
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <ChevronDown className="h-8 w-8 text-foreground/60 animate-bounce" />
        </motion.div>
      </section>

      {/* Filters Section */}
      <section className="py-8 px-6 border-b bg-card/50">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Tìm kiếm phòng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:w-1/3"
            />

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="md:w-1/4">
                <SelectValue placeholder="Loại phòng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại phòng</SelectItem>
                {roomTypes.map(type => (
                  <SelectItem key={type as string} value={type as string}>{type as string}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="md:w-1/4">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-asc">Giá: Thấp đến cao</SelectItem>
                <SelectItem value="price-desc">Giá: Cao đến thấp</SelectItem>
                <SelectItem value="capacity-asc">Sức chứa: Thấp đến cao</SelectItem>
                <SelectItem value="capacity-desc">Sức chứa: Cao đến thấp</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Rooms Grid */}
      <section className="py-12 px-6">
        <div className="container mx-auto">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="h-[500px] animate-pulse bg-muted" />
              ))}
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">Không tìm thấy phòng nào</p>
            </div>
          ) : (
            <>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredRooms.map((room, index) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer h-full flex flex-col">
                      <RoomImageSlider images={room.images || []} altText={room.roomType?.name || "Room"} onClick={() => navigate(`/rooms/${room.id}`)} />

                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold mb-1">{room.roomType?.name || "Unknown"}</h3>
                            <p className="text-sm text-muted-foreground">Phòng {room.roomNumber}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              {Number(room.roomType?.pricePerNight || 0).toLocaleString('vi-VN')}đ
                            </div>
                            <div className="text-xs text-muted-foreground">/ đêm</div>
                          </div>
                        </div>

                        <p className="text-muted-foreground mb-4 line-clamp-2 flex-1">
                          {room.roomType?.description || "Không có mô tả"}
                        </p>

                        <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>Tầng {room.floor}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-primary" />
                            <span>{room.roomType?.capacity || 0} người</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Maximize className="h-4 w-4 text-primary" />
                            <span>{room.roomType?.size || 0}m²</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {room.roomType?.amenities?.slice(0, 4).map((amenity: string) => {
                            const Icon = amenityIcons[amenity] || Coffee;
                            return (
                              <div key={amenity} className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Icon className="h-3 w-3" />
                                <span>{amenity}</span>
                              </div>
                            );
                          })}
                          {room.roomType?.amenities && room.roomType.amenities.length > 4 && (
                            <span className="text-xs text-muted-foreground">+{room.roomType.amenities.length - 4} khác</span>
                          )}
                        </div>

                        <Button
                          onClick={() => navigate(`/rooms/${room.id}`)}
                          className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                          disabled={room.roomStatus?.name !== "Available"}
                        >
                          {room.roomStatus?.name === "Available" ? "Xem chi tiết" : "Không khả dụng"}
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-primary to-accent text-white p-4 rounded-full shadow-lg hover:opacity-90 transition-opacity"
      >
        <ChevronDown className="h-6 w-6 rotate-180" />
      </motion.button>
      <Footer />
    </div>
  );
}