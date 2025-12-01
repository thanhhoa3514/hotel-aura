import { useState } from "react";
import { fixImageUrl } from "@/utils/fixURL";
import { ChevronLeft, ChevronRight } from "lucide-react";



export const RoomImageSlider = ({ images, altText, onClick }: { images: any[], altText: string, onClick: () => void }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Lấy danh sách URL ảnh sạch
    const validImages = images?.length > 0
        ? images.map(img => fixImageUrl(img.imageUrl))
        : [fixImageUrl(undefined)]; // Fallback image

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation(); // Ngăn click vào card cha
        setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="relative h-64 overflow-hidden group">
            {/* Ảnh hiện tại */}
            <img
                src={validImages[currentIndex]}
                alt={`${altText} - ${currentIndex + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                onClick={onClick}
            />

            {/* Nút điều hướng (Chỉ hiện khi có > 1 ảnh) */}
            {validImages.length > 1 && (
                <>
                    <button
                        onClick={handlePrev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>

                    {/* Dots Indicator */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {validImages.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1.5 rounded-full transition-all ${idx === currentIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};