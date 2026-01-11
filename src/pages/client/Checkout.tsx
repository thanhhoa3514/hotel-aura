import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, CreditCard, Calendar, Users, Info, Check, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { paymentService } from "@/services/paymentService";
import { format } from "date-fns";
import { ClientNavbar } from "@/components/layout/ClientNavbar";

interface CheckoutState {
  reservationId?: string;
  startDate?: Date;
  endDate?: Date;
  guests?: string;
  roomType?: string;
  roomId?: string;
  roomPrice?: number;
  roomImage?: string;
  roomNumber?: string;
}

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const bookingData = (location.state as CheckoutState) || {};
  const [showTripDetails, setShowTripDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [specialRequests, setSpecialRequests] = useState("");

  // Calculate pricing
  const nightlyRate = bookingData.roomPrice || 150;
  const numberOfNights = bookingData.startDate && bookingData.endDate
    ? Math.ceil((bookingData.endDate.getTime() - bookingData.startDate.getTime()) / (1000 * 60 * 60 * 24))
    : 1;
  const subtotal = nightlyRate * numberOfNights;
  const cleaningFee = 25;
  const serviceFee = subtotal * 0.1;
  const total = subtotal + cleaningFee + serviceFee;

  const handlePayment = async () => {
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      toast({
        title: "Yêu cầu đăng nhập",
        description: "Bạn cần đăng nhập để đặt phòng.",
        variant: "destructive",
      });
      navigate("/login", { state: { from: location } });
      return;
    }

    // Validate reservation ID exists
    if (!bookingData.reservationId) {
      toast({
        title: "Lỗi đặt phòng",
        description: "Không tìm thấy thông tin đặt phòng. Vui lòng đặt lại.",
        variant: "destructive",
      });
      navigate("/rooms");
      return;
    }

    setIsLoading(true);

    try {
      toast({
        title: "Đang chuyển đến trang thanh toán...",
        description: "Vui lòng đợi trong giây lát.",
      });

      // Create Stripe Checkout Session
      const baseUrl = window.location.origin;
      const response = await paymentService.createCheckoutSession({
        reservationId: bookingData.reservationId,
        successUrl: `${baseUrl}/payment-success`,
        cancelUrl: `${baseUrl}/payment-cancel`,
      });

      // Redirect to Stripe Checkout page
      if (response.sessionUrl) {
        window.location.href = response.sessionUrl;
      } else {
        throw new Error("Không thể tạo phiên thanh toán");
      }

    } catch (error: any) {
      console.error("Payment error:", error);

      const errorMessage = error?.response?.data?.message || error?.message || "Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.";

      toast({
        title: "Thanh toán thất bại",
        description: errorMessage,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <ClientNavbar currentPage="bookings" />

      {/* Back Button */}
      <div className="container mx-auto px-6 py-6 max-w-7xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Xac nhan va thanh toan
        </Button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-20 max-w-7xl">
        <div className="grid lg:grid-cols-[1fr,400px] gap-8">
          {/* Left Column - Payment & Policies */}
          <div className="space-y-8">
            {/* Authentication Warning */}
            {!isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-6 border-amber-500/50 bg-amber-500/10">
                  <div className="flex items-start gap-4">
                    <Info className="h-6 w-6 text-amber-500 shrink-0" />
                    <div>
                      <h3 className="font-semibold text-amber-500">Yeu cau dang nhap</h3>
                      <p className="text-muted-foreground mt-1">
                        Ban can dang nhap de hoan tat dat phong.{" "}
                        <button
                          onClick={() => navigate("/login", { state: { from: location } })}
                          className="text-primary underline"
                        >
                          Dang nhap ngay
                        </button>
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Payment Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6 border-primary/20 bg-primary/5">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-2">Thanh toán qua Stripe</h2>

                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Cancellation Policy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Chinh sach huy phong</h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <p className="text-muted-foreground">
                      Mien phi huy phong truoc ngay 30 thang 11.
                    </p>
                  </div>
                  <p className="text-muted-foreground">
                    Sau do, viec dat phong se khong duoc hoan tien.{" "}
                    <button className="text-primary underline">Tim hieu them</button>
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Ground Rules */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Quy tac chung</h2>
                <p className="text-muted-foreground mb-4">
                  Chung toi yeu cau moi khach nho mot vai dieu don gian ve nhung gi tao nen mot vi khach tuyet voi.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">-</span>
                    <span>Tuan thu noi quy nha</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">-</span>
                    <span>Doi xu voi nha cua chu nha nhu nha cua ban</span>
                  </li>
                </ul>
              </Card>
            </motion.div>

            {/* Special Requests */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold">Yeu cau dac biet</h2>
                </div>
                <p className="text-muted-foreground mb-4 text-sm">
                  Co dieu gi dac biet ban muon chung toi biet? (Khong bat buoc)
                </p>
                <Textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Vi du: Phong tang cao, giuong doi, khong hut thuoc..."
                  className="min-h-[100px] resize-none"
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground mt-2 text-right">
                  {specialRequests.length}/500
                </p>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Trip Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="p-6">
                {/* Room Image */}
                <div className="relative rounded-xl overflow-hidden mb-4">
                  <img
                    src={bookingData.roomImage || "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800"}
                    alt="Room"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-3 left-3">
                    <Badge className="bg-background/90 text-foreground backdrop-blur-sm">
                      {bookingData.roomType || "Deluxe Room"}
                    </Badge>
                  </div>
                  {bookingData.roomNumber && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                        Phong {bookingData.roomNumber}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Trip Info */}
                <div className="space-y-4 mb-6">
                  <div>
                    <h3 className="font-bold text-lg mb-1">Noi luu tru</h3>
                    <p className="text-muted-foreground">HotelPro, Viet Nam</p>
                  </div>

                  <button
                    onClick={() => setShowTripDetails(!showTripDetails)}
                    className="flex items-center justify-between w-full text-sm text-primary hover:underline"
                  >
                    <span>{showTripDetails ? "An" : "Xem"} chi tiet chuyen di</span>
                    <ChevronLeft className={`h-4 w-4 transition-transform ${showTripDetails ? "rotate-90" : "-rotate-90"}`} />
                  </button>

                  {showTripDetails && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-3 pt-2"
                    >
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="h-4 w-4 text-primary" />
                        <div>
                          <p className="font-medium">Check-In</p>
                          <p className="text-muted-foreground">
                            {bookingData.startDate ? format(bookingData.startDate, "E, MMM dd") : "Chua chon"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="h-4 w-4 text-primary" />
                        <div>
                          <p className="font-medium">Check-Out</p>
                          <p className="text-muted-foreground">
                            {bookingData.endDate ? format(bookingData.endDate, "E, MMM dd") : "Chua chon"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Users className="h-4 w-4 text-primary" />
                        <div>
                          <p className="font-medium">Khach</p>
                          <p className="text-muted-foreground">{bookingData.guests || "1"} nguoi</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                <Separator className="my-6" />

                {/* Pricing Breakdown */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">Chi tiet gia</h3>

                  <div className="space-y-3">
                    <div className="flex justify-between text-muted-foreground">
                      <span>${nightlyRate.toLocaleString()} x {numberOfNights} dem</span>
                      <span>${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Phi ve sinh</span>
                      <span>${cleaningFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Phi dich vu</span>
                      <span>${serviceFee.toLocaleString()}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Tong truoc thue</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={isLoading || !isAuthenticated}
                  className="w-full mt-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg py-6"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Dang xu ly...
                    </>
                  ) : (
                    `Xac nhan va thanh toan $${total.toLocaleString()}`
                  )}
                </Button>

                <div className="flex items-start gap-2 mt-4 text-xs text-muted-foreground">
                  <Info className="h-4 w-4 shrink-0 mt-0.5" />
                  <p>
                    Ban se khong bi tinh phi ngay bay gio. Chung toi se gui email xac nhan va chi tiet thanh toan.
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
