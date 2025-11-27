import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Wifi, Tv, Wind, Coffee, Eye, MapPin, Users, Maximize, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

const statusMap = {
  available: { label: "Có sẵn", variant: "default" as const },
  occupied: { label: "Đã đặt", variant: "secondary" as const },
  maintenance: { label: "Bảo trì", variant: "destructive" as const },
};

export default function ClientRooms() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<any[]>([]);
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
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .order("room_number", { ascending: true });

      if (error) throw error;
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
        room.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.room_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === "all" || room.room_type.toLowerCase() === filterType.toLowerCase();
      
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return Number(a.price) - Number(b.price);
        case "price-desc":
          return Number(b.price) - Number(a.price);
        case "capacity-asc":
          return a.capacity - b.capacity;
        case "capacity-desc":
          return b.capacity - a.capacity;
        default:
          return 0;
      }
    });

  const roomTypes = Array.from(new Set(rooms.map(room => room.room_type)));

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

          <Button onClick={() => navigate("/")} className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
            Đặt phòng
          </Button>
        </div>
      </motion.header>

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
                  <SelectItem key={type} value={type}>{type}</SelectItem>
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
              <div className="mb-6 text-muted-foreground">
                Tìm thấy {filteredRooms.length} phòng
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredRooms.map((room, index) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer h-full flex flex-col">
                      <div className="relative h-64 overflow-hidden" onClick={() => navigate(`/rooms/${room.id}`)}>
                        <img
                          src={room.image_url || "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800"}
                          alt={room.room_type}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 right-4">
                          <Badge variant={statusMap[room.status as keyof typeof statusMap]?.variant || "default"}>
                            {statusMap[room.status as keyof typeof statusMap]?.label || room.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold mb-1">{room.room_type}</h3>
                            <p className="text-sm text-muted-foreground">Phòng {room.room_number}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              {Number(room.price).toLocaleString('vi-VN')}đ
                            </div>
                            <div className="text-xs text-muted-foreground">/ đêm</div>
                          </div>
                        </div>

                        <p className="text-muted-foreground mb-4 line-clamp-2 flex-1">
                          {room.description}
                        </p>

                        <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>Tầng {room.floor}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-primary" />
                            <span>{room.capacity} người</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Maximize className="h-4 w-4 text-primary" />
                            <span>{room.size}m²</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {room.amenities?.slice(0, 4).map((amenity: string) => {
                            const Icon = amenityIcons[amenity] || Coffee;
                            return (
                              <div key={amenity} className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Icon className="h-3 w-3" />
                                <span>{amenity}</span>
                              </div>
                            );
                          })}
                          {room.amenities?.length > 4 && (
                            <span className="text-xs text-muted-foreground">+{room.amenities.length - 4} khác</span>
                          )}
                        </div>

                        <Button 
                          onClick={() => navigate(`/rooms/${room.id}`)}
                          className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                          disabled={room.status !== "available"}
                        >
                          {room.status === "available" ? "Xem chi tiết" : "Không khả dụng"}
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

      {/* Footer */}
      <footer className="bg-card border-t py-12 px-6 mt-20">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2025 HotelPro — All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}