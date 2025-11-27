import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, CreditCard, Calendar, Users, Info, Check, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface CheckoutState {
  startDate?: Date;
  endDate?: Date;
  guests?: string;
  roomType?: string;
  roomPrice?: number;
  roomImage?: string;
}

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const bookingData = (location.state as CheckoutState) || {};
  
  const [selectedPayment, setSelectedPayment] = useState("mastercard");
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showTripDetails, setShowTripDetails] = useState(false);

  // Calculate pricing
  const nightlyRate = bookingData.roomPrice || 150;
  const numberOfNights = bookingData.startDate && bookingData.endDate 
    ? Math.ceil((bookingData.endDate.getTime() - bookingData.startDate.getTime()) / (1000 * 60 * 60 * 24))
    : 1;
  const subtotal = nightlyRate * numberOfNights;
  const cleaningFee = 25;
  const serviceFee = subtotal * 0.1;
  const total = subtotal + cleaningFee + serviceFee;

  const handlePayment = () => {
    toast({
      title: "Đặt phòng thành công!",
      description: "Bạn sẽ nhận được email xác nhận trong giây lát.",
    });
    setTimeout(() => navigate("/"), 2000);
  };

  const savedPayments = [
    { id: "paypal", type: "PayPal", last4: "1234", expiry: "06/2024", icon: "paypal" },
    { id: "mastercard", type: "Mastercard", last4: "1234", expiry: "06/2024", icon: "mastercard" },
    { id: "visa", type: "Visa", last4: "1234", expiry: "06/2024", icon: "visa" },
  ];

  const getPaymentIcon = (iconType: string) => {
    switch (iconType) {
      case "paypal":
        return <Wallet className="h-6 w-6 text-primary" />;
      case "mastercard":
        return <CreditCard className="h-6 w-6 text-primary" />;
      case "visa":
        return <CreditCard className="h-6 w-6 text-primary" />;
      default:
        return <CreditCard className="h-6 w-6 text-primary" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 backdrop-blur-md bg-card/80 border-b"
      >
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
              <span className="text-lg font-bold text-primary-foreground">HP</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              HotelPro
            </span>
          </button>
        </div>
      </motion.header>

      {/* Back Button */}
      <div className="container mx-auto px-6 py-6 max-w-7xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Xác nhận & thanh toán
        </Button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-20 max-w-7xl">
        <div className="grid lg:grid-cols-[1fr,400px] gap-8">
          {/* Left Column - Payment & Policies */}
          <div className="space-y-8">
            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6">Phương thức thanh toán</h2>
                
                <div className="space-y-4">
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-muted-foreground">Thẻ đã lưu</p>
                    <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
                      <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                        {savedPayments.map((payment) => (
                          <label
                            key={payment.id}
                            htmlFor={payment.id}
                            className={`flex flex-col gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-[1.02] ${
                              selectedPayment === payment.id
                                ? "border-primary bg-accent/50"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              {getPaymentIcon(payment.icon)}
                              <RadioGroupItem value={payment.id} id={payment.id} />
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{payment.type}</p>
                              <p className="text-xs text-muted-foreground">**** {payment.last4}</p>
                              <p className="text-xs text-muted-foreground">Expiry {payment.expiry}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <Button
                    variant="ghost"
                    className="w-full justify-start text-primary gap-2"
                    onClick={() => setShowAddPayment(!showAddPayment)}
                  >
                    <CreditCard className="h-4 w-4" />
                    Thêm phương thức thanh toán mới
                  </Button>

                  {showAddPayment && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-4 pt-4"
                    >
                      <div>
                        <Label htmlFor="cardNumber">Số thẻ</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Ngày hết hạn</Label>
                          <Input id="expiry" placeholder="MM/YY" />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" />
                        </div>
                      </div>
                    </motion.div>
                  )}
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
                <h2 className="text-xl font-bold mb-4">Chính sách hủy phòng</h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <p className="text-muted-foreground">
                      Miễn phí hủy phòng trước ngày 30 tháng 11.
                    </p>
                  </div>
                  <p className="text-muted-foreground">
                    Sau đó, việc đặt phòng sẽ không được hoàn tiền.{" "}
                    <button className="text-primary underline">Tìm hiểu thêm</button>
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
                <h2 className="text-xl font-bold mb-4">Quy tắc chung</h2>
                <p className="text-muted-foreground mb-4">
                  Chúng tôi yêu cầu mọi khách nhớ một vài điều đơn giản về những gì tạo nên một vị khách tuyệt vời.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Tuân thủ nội quy nhà</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Đối xử với nhà của chủ nhà như nhà của bạn</span>
                  </li>
                </ul>
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
                </div>

                {/* Trip Info */}
                <div className="space-y-4 mb-6">
                  <div>
                    <h3 className="font-bold text-lg mb-1">Nơi lưu trú</h3>
                    <p className="text-muted-foreground">HotelPro, Việt Nam</p>
                  </div>

                  <button
                    onClick={() => setShowTripDetails(!showTripDetails)}
                    className="flex items-center justify-between w-full text-sm text-primary hover:underline"
                  >
                    <span>{showTripDetails ? "Ẩn" : "Xem"} chi tiết chuyến đi</span>
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
                            {bookingData.startDate ? format(bookingData.startDate, "E, MMM dd") : "Chưa chọn"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="h-4 w-4 text-primary" />
                        <div>
                          <p className="font-medium">Check-Out</p>
                          <p className="text-muted-foreground">
                            {bookingData.endDate ? format(bookingData.endDate, "E, MMM dd") : "Chưa chọn"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Users className="h-4 w-4 text-primary" />
                        <div>
                          <p className="font-medium">Khách</p>
                          <p className="text-muted-foreground">{bookingData.guests || "1"} người</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                <Separator className="my-6" />

                {/* Pricing Breakdown */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">Chi tiết giá</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-muted-foreground">
                      <span>${nightlyRate.toLocaleString()} x {numberOfNights} đêm</span>
                      <span>${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Phí vệ sinh</span>
                      <span>${cleaningFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Phí dịch vụ</span>
                      <span>${serviceFee.toLocaleString()}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Tổng trước thuế</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  className="w-full mt-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-lg py-6"
                >
                  Xác nhận & thanh toán ${total.toLocaleString()}
                </Button>

                <div className="flex items-start gap-2 mt-4 text-xs text-muted-foreground">
                  <Info className="h-4 w-4 shrink-0 mt-0.5" />
                  <p>
                    Bạn sẽ không bị tính phí ngay bây giờ. Chúng tôi sẽ gửi email xác nhận và chi tiết thanh toán.
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
