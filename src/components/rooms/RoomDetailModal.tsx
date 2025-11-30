import { motion, AnimatePresence } from "framer-motion";
import { X, Bed, Users, Wifi, Tv, Coffee, Bath } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Room } from "@/types";
import { getRoomStatusInfo, getRoomStatusOptions } from "@/utils/roomStatus";

interface RoomDetailModalProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedRoom: Room) => void;
}

const amenityIcons: Record<string, any> = {
  wifi: Wifi,
  tv: Tv,
  coffee: Coffee,
  bath: Bath,
};

export const RoomDetailModal = ({ room, isOpen, onClose, onSave }: RoomDetailModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedRoom, setEditedRoom] = useState(room);

  if (!room) return null;

  const handleSave = () => {
    onSave(editedRoom);
    setIsEditing(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-card border border-border rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden pointer-events-auto">
              {/* Header with Image */}
              <div className="relative h-64 bg-gradient-to-br from-primary/30 to-accent/30">
                {room.images ? (
                  <img
                    src={room.images[0].imageUrl}
                    alt={`Room ${room.number}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-9xl font-bold text-white/20">{room.number}</div>
                  </div>
                )}

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <Badge variant={getRoomStatusInfo(room.status.name).variant} className="text-sm px-3 py-1">
                    {getRoomStatusInfo(room.status.name).label}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 overflow-y-auto max-h-[calc(90vh-16rem)]">
                <div className="space-y-6">
                  {/* Title & Basic Info */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-3xl font-bold">Phòng {room.number}</h2>
                      <p className="text-lg text-muted-foreground mt-1">{room.roomType.name}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">{room.roomType.pricePerNight.toLocaleString('vi-VN')} VNĐ</div>
                      <div className="text-sm text-muted-foreground">/ đêm</div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                      <Bed className="h-5 w-5 text-primary" />
                      <div>
                        <div className="text-xs text-muted-foreground">Tầng</div>
                        <div className="font-semibold">{room.floor}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <div className="text-xs text-muted-foreground">Sức chứa</div>
                        <div className="font-semibold">{room.capacity || 2} người</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                      <Bath className="h-5 w-5 text-primary" />
                      <div>
                        <div className="text-xs text-muted-foreground">Diện tích</div>
                        <div className="font-semibold">{room.size || "25m²"}</div>
                      </div>
                    </div>
                  </div>

                  {/* Edit Form or Display */}
                  {isEditing ? (
                    <div className="space-y-4 border-t pt-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Số phòng</Label>
                          <Input
                            value={editedRoom?.number}
                            onChange={(e) => setEditedRoom({ ...editedRoom!, number: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Loại phòng</Label>
                          <Input
                            value={editedRoom?.roomType.name}
                            onChange={(e) => setEditedRoom({ ...editedRoom!, roomType: { ...editedRoom!.roomType, name: e.target.value } })}
                          />
                        </div>
                        <div>
                          <Label>Giá/đêm (VNĐ)</Label>
                          <Input
                            type="number"
                            value={editedRoom?.roomType.pricePerNight}
                            onChange={(e) => setEditedRoom({ ...editedRoom!, roomType: { ...editedRoom!.roomType, pricePerNight: parseInt(e.target.value) } })}
                          />
                        </div>
                        <div>
                          <Label>Trạng thái</Label>
                          <Select
                            value={editedRoom?.status?.name}
                            onValueChange={(value) => setEditedRoom({
                              ...editedRoom!,
                              status: {
                                id: editedRoom!.status.id,
                                name: value
                              }
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {getRoomStatusOptions().map(({ value, label }) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label>Mô tả</Label>
                        <Textarea
                          value={editedRoom?.description || ""}
                          onChange={(e) => setEditedRoom({ ...editedRoom!, description: e.target.value })}
                          rows={3}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Description */}
                      <div>
                        <h3 className="font-semibold mb-2">Mô tả</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {room.description || "Phòng tiện nghi, đầy đủ nội thất cao cấp với không gian rộng rãi, thoáng mát. Thiết kế hiện đại kết hợp với sự thoải mái tối đa cho khách hàng."}
                        </p>
                      </div>

                      {/* Amenities */}
                      <div>
                        <h3 className="font-semibold mb-3">Tiện nghi</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {(room.amenities || ["wifi", "tv", "coffee", "bath"]).map((amenity) => {
                            const Icon = amenityIcons[amenity] || Wifi;
                            return (
                              <div key={amenity} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                                <Icon className="h-4 w-4 text-primary" />
                                <span className="text-sm capitalize">{amenity}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Last Booking */}
                      {room.lastBooking && (
                        <div className="border-t pt-4">
                          <h3 className="font-semibold mb-2">Đặt phòng gần nhất</h3>
                          <p className="text-sm text-muted-foreground">{room.lastBooking}</p>
                        </div>
                      )}
                    </>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t">
                    {isEditing ? (
                      <>
                        <Button onClick={handleSave} className="flex-1">
                          Lưu thay đổi
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                          Hủy
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={() => setIsEditing(true)} className="flex-1">
                          Chỉnh sửa
                        </Button>
                        <Button variant="outline" onClick={onClose} className="flex-1">
                          Đóng
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
