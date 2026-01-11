import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar as CalendarIcon, Users, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { DateRangeModal } from "./DateRangeModal";
import { format } from "date-fns";
import { roomService } from "@/services/roomService";
import { reservationService } from "@/services/reservationService";
import { RoomResponse } from "@/types/api.types";

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preSelectedRoom?: {
    id: string;
    roomNumber: string;
    roomType: string;
    pricePerNight: number;
    imageUrl?: string;

  };
  isFixedRoom?: boolean;
}

export const BookingModal = ({ open, onOpenChange, preSelectedRoom, isFixedRoom = false }: BookingModalProps) => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availableRooms, setAvailableRooms] = useState<RoomResponse[]>([]);
  const [formData, setFormData] = useState({
    guests: "1",
    roomId: preSelectedRoom?.id || "",
  });

  // Load available rooms when dates change
  useEffect(() => {
    if (startDate && endDate) {
      loadAvailableRooms();
    }
  }, [startDate, endDate]);

  // Set preSelectedRoom when it changes
  useEffect(() => {
    if (preSelectedRoom) {
      setFormData(prev => ({ ...prev, roomId: preSelectedRoom.id }));
    }
  }, [preSelectedRoom]);

  const loadAvailableRooms = async () => {
    if (!startDate || !endDate) return;

    setIsCheckingAvailability(true);
    try {
      const checkIn = format(startDate, "yyyy-MM-dd");
      const checkOut = format(endDate, "yyyy-MM-dd");
      const rooms = await reservationService.getAvailableRooms(checkIn, checkOut);
      setAvailableRooms(rooms);

      // If preSelectedRoom is not in available rooms, reset selection
      if (preSelectedRoom && !rooms.find(r => r.id === preSelectedRoom.id)) {
        setFormData(prev => ({ ...prev, roomId: "" }));
        toast({
          title: "Phong khong kha dung",
          description: `Phong ${preSelectedRoom.roomNumber} da duoc dat trong khoang thoi gian nay.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error loading available rooms:", error);
      // Fallback to all rooms if API fails
      try {
        const allRooms = await roomService.getAllRooms();
        setAvailableRooms(allRooms);
      } catch (e) {
        console.error("Error loading all rooms:", e);
      }
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const handleDateConfirm = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  const getSelectedRoom = () => {
    if (preSelectedRoom && formData.roomId === preSelectedRoom.id) {
      return preSelectedRoom;
    }
    const room = availableRooms.find(r => r.id === formData.roomId);
    if (room) {
      return {
        id: room.id,
        roomNumber: room.roomNumber,
        roomType: room.roomType?.name || "Standard",
        pricePerNight: room.roomType?.pricePerNight || 150,
        imageUrl: room.images?.[0]?.imageUrl,
      };
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check authentication first
    if (!isAuthenticated || !user) {
      toast({
        title: "Yeu cau dang nhap",
        description: "Ban can dang nhap de dat phong.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!startDate || !endDate) {
      toast({
        title: "Vui long chon ngay",
        description: "Ban can chon ngay nhan phong va ngay tra phong",
        variant: "destructive",
      });
      return;
    }

    if (!formData.roomId) {
      toast({
        title: "Vui long chon phong",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Verify room availability
      const checkIn = format(startDate, "yyyy-MM-dd");
      const checkOut = format(endDate, "yyyy-MM-dd");

      toast({
        title: "Dang kiem tra phong...",
        description: "Vui long doi trong giay lat.",
      });

      const availabilityResponse = await reservationService.checkRoomAvailability({
        roomIds: [formData.roomId],
        checkIn,
        checkOut,
      });

      if (!availabilityResponse.allAvailable) {
        toast({
          title: "Phong khong kha dung",
          description: "Phong da duoc dat trong khoang thoi gian nay. Vui long chon phong khac hoac thay doi ngay.",
          variant: "destructive",
        });
        setIsLoading(false);
        loadAvailableRooms();
        return;
      }

      // Step 2: Create reservation with PENDING status
      toast({
        title: "Dang tao dat phong...",
        description: "He thong dang xu ly yeu cau cua ban.",
      });

      const reservation = await reservationService.createReservation({
        keycloakUserId: user.keycloakUserId || user.id,
        roomIds: [formData.roomId],
        checkIn,
        checkOut,
        numberOfGuests: parseInt(formData.guests),
        status: "PENDING",
      });

      const selectedRoom = getSelectedRoom();

      // Step 3: Navigate to checkout with reservation ID
      toast({
        title: "Thanh cong!",
        description: "Chuyen den trang thanh toan...",
      });

      onOpenChange(false);
      navigate("/checkout", {
        state: {
          reservationId: reservation.id,
          startDate,
          endDate,
          guests: formData.guests,
          roomId: formData.roomId,
          roomType: selectedRoom?.roomType || "Standard",
          roomNumber: selectedRoom?.roomNumber,
          roomPrice: selectedRoom?.pricePerNight || 150,
          roomImage: selectedRoom?.imageUrl || "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800",
        },
      });
    } catch (error: any) {
      console.error("Error creating reservation:", error);
      const errorMessage = error?.response?.data?.message || "Khong the tao dat phong. Vui long thu lai.";
      toast({
        title: "Co loi xay ra",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedRoom = getSelectedRoom();
  const numberOfNights = startDate && endDate
    ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const estimatedTotal = selectedRoom ? selectedRoom.pricePerNight * numberOfNights : 0;

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
            className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-card rounded-2xl shadow-2xl border p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Dat Phong
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
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="checkIn" className="flex items-center gap-2 mb-2">
                          <CalendarIcon className="h-4 w-4" />
                          Ngay nhan phong
                        </Label>
                        <Input
                          id="checkIn"
                          type="text"
                          value={startDate ? format(startDate, "dd/MM/yyyy") : ""}
                          placeholder="Chon ngay"
                          onClick={() => setShowDatePicker(true)}
                          readOnly
                          required
                          className="cursor-pointer hover:bg-accent/50 transition-colors"
                        />
                      </div>

                      <div>
                        <Label htmlFor="checkOut" className="flex items-center gap-2 mb-2">
                          <CalendarIcon className="h-4 w-4" />
                          Ngay tra phong
                        </Label>
                        <Input
                          id="checkOut"
                          type="text"
                          value={endDate ? format(endDate, "dd/MM/yyyy") : ""}
                          placeholder="Chon ngay"
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
                        So luong khach
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
                          <SelectItem value="1">1 Khach</SelectItem>
                          <SelectItem value="2">2 Khach</SelectItem>
                          <SelectItem value="3">3 Khach</SelectItem>
                          <SelectItem value="4">4 Khach</SelectItem>
                          <SelectItem value="5+">5+ Khach</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Phòng đã chọn</Label>

                    {isFixedRoom && preSelectedRoom ? (
                      // Nếu là Fixed Room -> Chỉ hiện thông tin tĩnh, không cho chọn lại
                      <div className="p-4 border rounded-lg bg-muted/50 flex justify-between items-center">
                        <div>
                          <p className="font-bold">{preSelectedRoom.roomType}</p>
                          <p className="text-sm text-muted-foreground">Phòng {preSelectedRoom.roomNumber}</p>
                        </div>
                        <p className="font-bold text-primary">${preSelectedRoom.pricePerNight}/đêm</p>
                      </div>
                    ) : (
                      <Select
                        value={formData.roomId}
                        onValueChange={(value) =>
                          setFormData({ ...formData, roomId: value })
                        }
                        disabled={isCheckingAvailability}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chon phong" />
                        </SelectTrigger>
                        <SelectContent>
                          {preSelectedRoom && (
                            <SelectItem value={preSelectedRoom.id}>
                              Phong {preSelectedRoom.roomNumber} - {preSelectedRoom.roomType} - ${preSelectedRoom.pricePerNight}/dem
                            </SelectItem>
                          )}
                          {availableRooms
                            .filter(room => room.id !== preSelectedRoom?.id)
                            .map((room) => (
                              <SelectItem key={room.id} value={room.id}>
                                Phong {room.roomNumber} - {room.roomType?.name} - ${room.roomType?.pricePerNight}/dem
                              </SelectItem>
                            ))}
                          {availableRooms.length === 0 && !preSelectedRoom && !isCheckingAvailability && startDate && endDate && (
                            <SelectItem value="none" disabled>
                              Khong co phong kha dung
                            </SelectItem>
                          )}
                          {!startDate && !endDate && (
                            <SelectItem value="none" disabled>
                              Vui long chon ngay truoc
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    )}


                    {/* Price Summary */}
                    {selectedRoom && numberOfNights > 0 && (
                      <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            ${selectedRoom.pricePerNight} x {numberOfNights} dem
                          </span>
                          <span className="font-medium">${estimatedTotal}</span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span>Tong uoc tinh</span>
                          <span className="text-primary">${estimatedTotal}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || isCheckingAvailability}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg py-6"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Dang xu ly...
                    </>
                  ) : (
                    "Tiep tuc dat phong"
                  )}
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
