import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RoomImageManager } from "./RoomImageManager";
import { toast } from "@/hooks/use-toast";
import { Room } from "@/types";
import { roomService } from "@/services/roomService";
import { roomTypeService, RoomTypeResponse } from "@/services/roomTypeService";
import { roomStatusService, RoomStatusResponse } from "@/services/roomStatusService";

interface ImageItem {
  id: string;
  file: File;
  preview: string;
}

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (roomData: any) => void;
  editRoom?: Room | null;
  mode?: "add" | "edit";
}

export const AddRoomModal = ({ isOpen, onClose, onSave, editRoom, mode = "add" }: AddRoomModalProps) => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [formData, setFormData] = useState({
    number: "",
    type: "",
    floor: "",
    capacity: "",
    size: "",
    price: "",
    description: "",
    amenities: [] as string[],
  });
  const [roomTypes, setRoomTypes] = useState<RoomTypeResponse[]>([]);
  const [roomStatuses, setRoomStatuses] = useState<RoomStatusResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(false);

  // ✅ FLOW CHUẨN: Fetch room types VÀ room statuses khi modal mở
  useEffect(() => {
    if (isOpen) {
      fetchInitialData();
    }
  }, [isOpen]);

  const fetchInitialData = async () => {
    setIsFetchingData(true);
    try {
      // Gọi song song 2 API
      const [types, statuses] = await Promise.all([
        roomTypeService.getAllRoomTypes(),
        roomStatusService.getAllRoomStatuses()
      ]);
      setRoomTypes(types);
      setRoomStatuses(statuses);
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu ban đầu",
        variant: "destructive",
      });
    } finally {
      setIsFetchingData(false);
    }
  };

  // Load edit room data when modal opens in edit mode
  useEffect(() => {
    if (editRoom && mode === "edit") {
      setFormData({
        number: editRoom.number || "",
        type: editRoom.roomType?.name || "",
        floor: editRoom.floor?.toString() || "",
        capacity: editRoom.capacity?.toString() || "",
        size: editRoom.size.toString() || "",
        price: editRoom.roomType?.pricePerNight?.toString() || "",
        description: editRoom.description || "",
        amenities: editRoom.amenities || [],
      });
      // Note: Images from server would need to be converted to ImageItem format
      // This is a simplified version - you may need to fetch actual image files
    } else if (mode === "add") {
      // Reset form when switching to add mode
      setFormData({
        number: "",
        type: "",
        floor: "",
        capacity: "",
        size: "",
        price: "",
        description: "",
        amenities: [],
      });
      setImages([]);
    }
  }, [editRoom, mode, isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // ✅ FLOW CHUẨN: Auto-fill khi chọn loại phòng
  const handleRoomTypeChange = (typeName: string) => {
    const selectedType = roomTypes.find(rt => rt.name === typeName);
    if (selectedType) {
      setFormData(prev => ({
        ...prev,
        type: typeName,
        price: selectedType.pricePerNight.toString(),
        capacity: selectedType.capacity?.toString() || "",
        size: selectedType.size?.toString() || ""
      }));
    } else {
      setFormData(prev => ({ ...prev, type: typeName }));
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.number || !formData.type) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng điền đầy đủ các trường bắt buộc",
        variant: "destructive",
      });
      return;
    }

    // Only require images for new rooms
    if (mode === "add" && images.length === 0) {
      toast({
        title: "Chưa có ảnh",
        description: "Vui lòng thêm ít nhất 1 ảnh phòng",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Find room type ID from selected type name
      const selectedRoomType = roomTypes.find(rt => rt.name === formData.type);
      if (!selectedRoomType) {
        throw new Error("Loại phòng không hợp lệ");
      }

      // Prepare room data matching backend RoomRequest
      const roomData = {
        roomNumber: formData.number,
        roomTypeId: selectedRoomType.id,
        roomStatusId: editRoom?.status?.id || undefined, // Use existing status or let backend set default
        floor: parseInt(formData.floor) || 1,
        note: formData.description || undefined,
      };

      // Prepare images
      const imageFiles = images.length > 0 ? images.map(img => img.file) : undefined;
      const imageOrder = images.length > 0 ? images.map(img => img.id) : undefined;

      let result;
      if (mode === "edit" && editRoom?.id) {
        // Update existing room
        result = await roomService.updateRoomWithImages(
          editRoom.id,
          roomData,
          imageFiles,
          imageOrder
        );
      } else {
        // Create new room
        result = await roomService.createRoomWithImages(
          roomData,
          imageFiles,
          imageOrder
        );
      }

      // Call parent onSave callback if provided
      if (onSave) {
        onSave(result);
      }

      // Reset form
      setFormData({
        number: "",
        type: "",
        floor: "",
        capacity: "",
        size: "",
        price: "",
        description: "",
        amenities: [],
      });
      setImages([]);

      toast({
        title: mode === "edit" ? "Đã cập nhật phòng" : "Đã thêm phòng mới",
        description: mode === "edit"
          ? `Phòng ${formData.number} đã được cập nhật thành công`
          : `Phòng ${formData.number} đã được thêm thành công`,
      });

      onClose();
    } catch (error: any) {
      console.error("Error saving room:", error);
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || error.message || "Không thể lưu phòng",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const amenitiesList = [
    { id: "wifi", label: "WiFi" },
    { id: "tv", label: "TV" },
    { id: "coffee", label: "Máy pha cà phê" },
    { id: "bath", label: "Bồn tắm" },
    { id: "minibar", label: "Minibar" },
    { id: "safe", label: "Két sắt" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {mode === "edit" ? "Chỉnh sửa phòng" : "Thêm phòng mới"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Cập nhật thông tin chi tiết của phòng"
              : "Điền thông tin chi tiết và thêm hình ảnh cho phòng mới"
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Information Section */}
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">1</span>
              Thông tin cơ bản
            </h3>
            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="number">
                  Số phòng <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="number"
                  placeholder="VD: 101"
                  value={formData.number}
                  onChange={(e) => handleInputChange("number", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">
                  Loại phòng <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={handleRoomTypeChange}
                  disabled={isFetchingData}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder={isFetchingData ? "Đang tải..." : "Chọn loại phòng"} />
                  </SelectTrigger>
                  <SelectContent>
                    {roomTypes.map((type) => (
                      <SelectItem key={type.id} value={type.name}>
                        {type.name} - {parseFloat(type.pricePerNight.toString()).toLocaleString('vi-VN')} VNĐ/đêm
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

              </div>

              <div className="space-y-2">
                <Label htmlFor="floor">Tầng</Label>
                <Input
                  id="floor"
                  type="number"
                  placeholder="VD: 1"
                  value={formData.floor}
                  onChange={(e) => handleInputChange("floor", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Sức chứa (người)</Label>
                <Input
                  id="capacity"
                  type="number"
                  placeholder="VD: 2"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange("capacity", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="size">Diện tích</Label>
                <Input
                  id="size"
                  placeholder="VD: 25m²"
                  value={formData.size}
                  onChange={(e) => handleInputChange("size", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">
                  Giá/đêm (VNĐ) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="VD: 500000"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                placeholder="Mô tả chi tiết về phòng..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Tiện nghi</Label>
              <div className="grid grid-cols-3 gap-3">
                {amenitiesList.map((amenity) => (
                  <label
                    key={amenity.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity.id)}
                      onChange={() => handleAmenityToggle(amenity.id)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{amenity.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </Card>

          {/* Image Management Section */}
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">2</span>
              Quản lý hình ảnh
            </h3>
            <Separator />

            <RoomImageManager images={images} onChange={setImages} />
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || isFetchingData}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              mode === "edit" ? "Cập nhật phòng" : "Thêm phòng"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
