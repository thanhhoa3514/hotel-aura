import { useState, useCallback } from "react";
import { X, Upload, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "@/hooks/use-toast";

interface ImageItem {
  id: string;
  file: File;
  preview: string;
}

interface RoomImageManagerProps {
  images: ImageItem[];
  onChange: (images: ImageItem[]) => void;
}

const SortableImage = ({ image, onDelete }: { image: ImageItem; onDelete: () => void }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group aspect-square rounded-lg overflow-hidden bg-muted border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 transition-all"
    >
      <img
        src={image.preview}
        alt="Room preview"
        className="w-full h-full object-cover"
      />
      
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 p-1 bg-background/80 rounded cursor-move opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical className="h-4 w-4" />
      </div>

      {/* Delete Button */}
      <Button
        variant="destructive"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={onDelete}
      >
        <X className="h-3 w-3" />
      </Button>

      {/* Image number indicator */}
      <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-background/80 rounded text-xs font-medium">
        {image.id}
      </div>
    </div>
  );
};

export const RoomImageManager = ({ images, onChange }: RoomImageManagerProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const validateFile = (file: File): boolean => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      toast({
        title: "Định dạng không hợp lệ",
        description: "Chỉ chấp nhận file JPG, PNG hoặc WEBP",
        variant: "destructive",
      });
      return false;
    }

    if (file.size > maxSize) {
      toast({
        title: "File quá lớn",
        description: "Kích thước file không được vượt quá 5MB",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const validFiles = Array.from(files).filter(validateFile);
    
    const newImages: ImageItem[] = validFiles.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      file,
      preview: URL.createObjectURL(file),
    }));

    if (newImages.length > 0) {
      onChange([...images, ...newImages]);
      toast({
        title: "Đã thêm ảnh",
        description: `Đã thêm ${newImages.length} ảnh mới`,
      });
    }
  }, [images, onChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  }, [handleFiles]);

  const handleDelete = useCallback((id: string) => {
    const imageToDelete = images.find(img => img.id === id);
    if (imageToDelete) {
      URL.revokeObjectURL(imageToDelete.preview);
    }
    onChange(images.filter(img => img.id !== id));
    toast({
      title: "Đã xóa ảnh",
      description: "Ảnh đã được xóa khỏi danh sách",
    });
  }, [images, onChange]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex(img => img.id === active.id);
      const newIndex = images.findIndex(img => img.id === over.id);
      
      const newImages = arrayMove(images, oldIndex, newIndex);
      onChange(newImages);
      
      toast({
        title: "Đã sắp xếp lại",
        description: "Thứ tự ảnh đã được cập nhật",
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <Card
        className={`p-8 border-2 border-dashed transition-all cursor-pointer ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/20 hover:border-primary/50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="room-images"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileInput}
          className="hidden"
        />
        <label
          htmlFor="room-images"
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          <div className="p-4 rounded-full bg-primary/10 mb-4">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-semibold text-lg mb-2">
            Kéo & thả ảnh vào đây
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            hoặc nhấn để chọn file từ máy tính
          </p>
          <p className="text-xs text-muted-foreground">
            Chấp nhận: JPG, PNG, WEBP (tối đa 5MB/ảnh)
          </p>
        </label>
      </Card>

      {/* Image Grid with Drag & Drop Sorting */}
      {images.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold">
              Ảnh đã tải lên ({images.length})
            </h4>
            <p className="text-xs text-muted-foreground">
              Kéo & thả để sắp xếp lại thứ tự
            </p>
          </div>
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={images.map(img => img.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image) => (
                  <SortableImage
                    key={image.id}
                    image={image}
                    onDelete={() => handleDelete(image.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
};
