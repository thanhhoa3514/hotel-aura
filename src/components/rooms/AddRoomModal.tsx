import { useState } from "react";
import { X } from "lucide-react";
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

interface ImageItem {
  id: string;
  file: File;
  preview: string;
}

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (roomData: any) => void;
}

export const AddRoomModal = ({ isOpen, onClose, onSave }: AddRoomModalProps) => {
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.number || !formData.type || !formData.price) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng điền đầy đủ các trường bắt buộc",
        variant: "destructive",
      });
      return;
    }

    if (images.length === 0) {
      toast({
        title: "Chưa có ảnh",
        description: "Vui lòng thêm ít nhất 1 ảnh phòng",
        variant: "destructive",
      });
      return;
    }

    // Create room data
    const roomData = {
      ...formData,
      floor: parseInt(formData.floor) || 1,
      capacity: parseInt(formData.capacity) || 2,
      price: parseFloat(formData.price) || 0,
      images: images.map(img => img.file),
      imageOrder: images.map(img => img.id),
      status: "available",
    };

    onSave(roomData);
    
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
      title: "Đã thêm phòng mới",
      description: `Phòng ${formData.number} đã được thêm thành công`,
    });
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
          <DialogTitle className="text-2xl">Thêm phòng mới</DialogTitle>
          <DialogDescription>
            Điền thông tin chi tiết và thêm hình ảnh cho phòng mới
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
                <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Chọn loại phòng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Deluxe">Deluxe</SelectItem>
                    <SelectItem value="Suite">Suite</SelectItem>
                    <SelectItem value="Presidential">Presidential</SelectItem>
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
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSubmit}>
            Thêm phòng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
