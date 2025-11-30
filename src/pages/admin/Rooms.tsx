import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Filter, Search, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RoomHoverCard } from "@/components/rooms/RoomHoverCard";
import { RoomDetailModal } from "@/components/rooms/RoomDetailModal";
import { AddRoomModal } from "@/components/rooms/AddRoomModal";
import { toast } from "@/hooks/use-toast";
import { roomService } from "@/services/roomService";
import { RoomResponse } from "@/types/api.types";
import { toast as sonnerToast } from "sonner";

// Map backend RoomResponse to frontend Room interface
const mapRoomResponseToRoom = (apiRoom: RoomResponse) => ({
  id: apiRoom.id,
  number: apiRoom.roomNumber,
  type: apiRoom.roomType.name,
  price: apiRoom.roomType.pricePerNight,
  status: apiRoom.status.name.toLowerCase(),
  floor: apiRoom.floor,
  size: "N/A", // Not provided by backend
  capacity: 2, // Default value
  description: apiRoom.note || "Không có mô tả",
  amenities: [] as string[], // Not provided by backend
  lastBooking: undefined,
});

const statusMap = {
  available: { label: "Trống", variant: "default" as const, color: "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/50" },
  occupied: { label: "Đã đặt", variant: "secondary" as const, color: "bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/50" },
  cleaning: { label: "Đang dọn", variant: "outline" as const, color: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/50" },
  maintenance: { label: "Bảo trì", variant: "destructive" as const, color: "bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-500/50" },
};

const Rooms = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredRoom, setHoveredRoom] = useState<any | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  // Fetch rooms from API on component mount
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const apiRooms = await roomService.getAllRooms();
      const mappedRooms = apiRooms.map(mapRoomResponseToRoom);
      setRooms(mappedRooms);
      sonnerToast.success(`Đã tải ${mappedRooms.length} phòng`);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      sonnerToast.error("Không thể tải danh sách phòng");
      setRooms([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.number.includes(searchTerm) || room.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || room.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleMouseEnter = (room: any, event: React.MouseEvent) => {
    // Clear any existing timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }

    // Set new timeout for 1.5 seconds
    const timeout = setTimeout(() => {
      setHoveredRoom(room);
      setHoverPosition({ x: event.clientX, y: event.clientY });
    }, 1500);

    setHoverTimeout(timeout);
  };

  const handleMouseLeave = () => {
    // Clear timeout if user leaves before modal appears
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setHoveredRoom(null);
  };

  const handleRowClick = (room: any) => {
    setSelectedRoom(room);
    setIsDetailModalOpen(true);
    setHoveredRoom(null);
  };

  const handleStatusChange = (roomId: number, newStatus: string) => {
    setRooms(prevRooms =>
      prevRooms.map(room =>
        room.id === roomId ? { ...room, status: newStatus } : room
      )
    );
    toast({
      title: "Đã cập nhật trạng thái",
      description: `Phòng ${rooms.find(r => r.id === roomId)?.number} đã được cập nhật sang trạng thái: ${statusMap[newStatus as keyof typeof statusMap].label}`,
    });
  };

  const handleSaveRoom = (updatedRoom: any) => {
    setRooms(prevRooms =>
      prevRooms.map(room =>
        room.id === updatedRoom.id ? updatedRoom : room
      )
    );
    toast({
      title: "Đã lưu thay đổi",
      description: `Thông tin phòng ${updatedRoom.number} đã được cập nhật.`,
    });
  };

  const handleAddRoom = (roomData: any) => {
    const newRoom = {
      id: rooms.length + 1,
      number: roomData.number,
      type: roomData.type,
      price: roomData.price,
      status: roomData.status,
      floor: roomData.floor,
      size: roomData.size,
      capacity: roomData.capacity,
      description: roomData.description,
      amenities: roomData.amenities,
    };

    setRooms(prevRooms => [...prevRooms, newRoom]);
    setIsAddModalOpen(false);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Quản lý phòng</h1>
            <p className="text-muted-foreground mt-1">Quản lý thông tin các phòng khách sạn</p>
          </div>
          <Button className="gap-2" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Thêm phòng
          </Button>
        </div>

        <Card className="p-6 rounded-2xl shadow-lg">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm phòng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 rounded-xl"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px] rounded-xl">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Loại phòng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="Standard">Standard</SelectItem>
                <SelectItem value="Deluxe">Deluxe</SelectItem>
                <SelectItem value="Suite">Suite</SelectItem>
                <SelectItem value="Presidential">Presidential</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-2xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-semibold">Số phòng</TableHead>
                  <TableHead className="font-semibold">Loại phòng</TableHead>
                  <TableHead className="font-semibold">Tầng</TableHead>
                  <TableHead className="font-semibold">Giá/đêm</TableHead>
                  <TableHead className="font-semibold">Trạng thái</TableHead>
                  <TableHead className="text-right font-semibold">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Đang tải dữ liệu...
                    </TableCell>
                  </TableRow>
                ) : filteredRooms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Không tìm thấy phòng nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRooms.map((room, index) => (
                    <motion.tr
                      key={room.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onMouseEnter={(e) => handleMouseEnter(room, e)}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => handleRowClick(room)}
                      className="cursor-pointer group hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300"
                    >
                      <TableCell className="font-medium group-hover:text-primary transition-colors">
                        {room.number}
                      </TableCell>
                      <TableCell className="group-hover:text-primary transition-colors">
                        {room.type}
                      </TableCell>
                      <TableCell>{room.floor}</TableCell>
                      <TableCell className="font-semibold">
                        {room.price.toLocaleString('vi-VN')} VNĐ
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              className="w-full text-left"
                            >
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Badge
                                  className={`${statusMap[room.status as keyof typeof statusMap].color} transition-all duration-300 cursor-pointer hover:shadow-md`}
                                >
                                  {statusMap[room.status as keyof typeof statusMap].label}
                                </Badge>
                              </motion.div>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Nhấn để thay đổi trạng thái</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRowClick(room);
                                }}
                                className="hover:bg-primary/10"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Xem chi tiết</p>
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRowClick(room);
                                }}
                                className="hover:bg-primary/10"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Chỉnh sửa</p>
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toast({
                                    title: "Xóa phòng",
                                    description: `Bạn có chắc muốn xóa phòng ${room.number}?`,
                                    variant: "destructive"
                                  });
                                }}
                                className="hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Xóa phòng</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Hover Preview Card */}
        <RoomHoverCard
          room={hoveredRoom!}
          isVisible={!!hoveredRoom}
          position={hoverPosition}
          onStatusChange={(newStatus) => {
            if (hoveredRoom) {
              handleStatusChange(hoveredRoom.id, newStatus);
            }
          }}
        />

        {/* Detail Modal */}
        <RoomDetailModal
          room={selectedRoom}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedRoom(null);
          }}
          onSave={handleSaveRoom}
        />

        {/* Add Room Modal */}
        <AddRoomModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddRoom}
        />
      </div>
    </TooltipProvider>
  );
};

export default Rooms;
