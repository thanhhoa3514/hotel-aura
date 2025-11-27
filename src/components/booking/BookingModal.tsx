import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar as CalendarIcon, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { DateRangeModal } from "./DateRangeModal";
import { format } from "date-fns";

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BookingModal = ({ open, onOpenChange }: BookingModalProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [formData, setFormData] = useState({
    guests: "1",
    roomType: "",
  });

  const handleDateConfirm = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  const getRoomPrice = (roomType: string) => {
    const prices: Record<string, number> = {
      deluxe: 150,
      executive: 280,
      ocean: 200,
    };
    return prices[roomType] || 150;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      toast({
        title: "Vui lòng chọn ngày",
        description: "Bạn cần chọn ngày nhận phòng và ngày trả phòng",
        variant: "destructive",
      });
      return;
    }

    if (!formData.roomType) {
      toast({
        title: "Vui lòng chọn loại phòng",
        variant: "destructive",
      });
      return;
    }

    // Navigate to checkout page with booking data
    onOpenChange(false);
    navigate("/checkout", {
      state: {
        startDate,
        endDate,
        guests: formData.guests,
        roomType: formData.roomType,
        roomPrice: getRoomPrice(formData.roomType),
        roomImage: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800",
      },
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: '-50%', y: 'calc(-50% + 20px)' }}
            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
            exit={{ opacity: 0, scale: 0.95, x: '-50%', y: 'calc(-50% + 20px)' }}
            className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-card rounded-2xl shadow-2xl border p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Book Your Stay
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onOpenChange(false)}
                  className="rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="checkIn" className="flex items-center gap-2 mb-2">
                      <CalendarIcon className="h-4 w-4" />
                      Ngày nhận phòng
                    </Label>
                    <Input
                      id="checkIn"
                      type="text"
                      value={startDate ? format(startDate, "dd/MM/yyyy") : ""}
                      placeholder="Chọn ngày"
                      onClick={() => setShowDatePicker(true)}
                      readOnly
                      required
                      className="cursor-pointer hover:bg-accent/50 transition-colors"
                    />
                  </div>

                  <div>
                    <Label htmlFor="checkOut" className="flex items-center gap-2 mb-2">
                      <CalendarIcon className="h-4 w-4" />
                      Ngày trả phòng
                    </Label>
                    <Input
                      id="checkOut"
                      type="text"
                      value={endDate ? format(endDate, "dd/MM/yyyy") : ""}
                      placeholder="Chọn ngày"
                      onClick={() => setShowDatePicker(true)}
                      readOnly
                      required
                      className="cursor-pointer hover:bg-accent/50 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="guests" className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4" />
                    Number of Guests
                  </Label>
                  <Select
                    value={formData.guests}
                    onValueChange={(value) =>
                      setFormData({ ...formData, guests: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Guest</SelectItem>
                      <SelectItem value="2">2 Guests</SelectItem>
                      <SelectItem value="3">3 Guests</SelectItem>
                      <SelectItem value="4">4 Guests</SelectItem>
                      <SelectItem value="5+">5+ Guests</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="roomType" className="mb-2 block">
                    Room Type
                  </Label>
                  <Select
                    value={formData.roomType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, roomType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="deluxe">Deluxe Room - $150/night</SelectItem>
                      <SelectItem value="executive">Executive Suite - $280/night</SelectItem>
                      <SelectItem value="ocean">Ocean View Room - $200/night</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg py-6"
                >
                  Confirm Booking
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Date Range Picker Modal */}
          <DateRangeModal
            open={showDatePicker}
            onOpenChange={setShowDatePicker}
            onConfirm={handleDateConfirm}
            startDate={startDate}
            endDate={endDate}
          />
        </>
      )}
    </AnimatePresence>
  );
};
