import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RoomHoverCardProps {
  room: {
    id: number;
    number: string;
    type: string;
    price: number;
    status: string;
    image?: string;
    description?: string;
    size?: string;
  };
  isVisible: boolean;
  position: { x: number; y: number };
  onStatusChange: (newStatus: string) => void;
}

const statusMap = {
  available: { label: "Trống", variant: "default" as const, color: "bg-green-500" },
  occupied: { label: "Đã đặt", variant: "secondary" as const, color: "bg-red-500" },
  cleaning: { label: "Đang dọn", variant: "outline" as const, color: "bg-yellow-500" },
  maintenance: { label: "Bảo trì", variant: "destructive" as const, color: "bg-orange-500" },
};

export const RoomHoverCard = ({ room, isVisible, position, onStatusChange }: RoomHoverCardProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed z-50 w-80 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
          style={{
            left: `${position.x + 20}px`,
            top: `${position.y - 100}px`,
          }}
        >
          {/* Room Image */}
          <div className="relative h-40 bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
            {room.image ? (
              <img 
                src={room.image} 
                alt={`Room ${room.number}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-muted-foreground/30">
                {room.number}
              </div>
            )}
          </div>

          {/* Card Content */}
          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">Phòng {room.number}</h3>
                <p className="text-sm text-muted-foreground">{room.type}</p>
              </div>
              <Badge variant={statusMap[room.status as keyof typeof statusMap].variant}>
                {statusMap[room.status as keyof typeof statusMap].label}
              </Badge>
            </div>

            {room.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {room.description}
              </p>
            )}

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Diện tích:</span>
              <span className="font-medium">{room.size || "25m²"}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Giá/đêm:</span>
              <span className="font-semibold text-primary">{room.price.toLocaleString('vi-VN')} VNĐ</span>
            </div>

            {/* Quick Status Change */}
            <div className="pt-2 border-t">
              <label className="text-xs text-muted-foreground mb-1 block">Thay đổi trạng thái nhanh:</label>
              <Select value={room.status} onValueChange={onStatusChange}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Trống</SelectItem>
                  <SelectItem value="occupied">Đã đặt</SelectItem>
                  <SelectItem value="cleaning">Đang dọn</SelectItem>
                  <SelectItem value="maintenance">Bảo trì</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
