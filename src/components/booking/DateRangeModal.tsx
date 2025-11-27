import { motion, AnimatePresence } from "framer-motion";
import { X, CalendarIcon, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format, differenceInDays, addDays } from "date-fns";

interface DateRangeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (startDate: Date, endDate: Date) => void;
  startDate?: Date;
  endDate?: Date;
}

const MIN_NIGHTS = 2;
const MAX_NIGHTS = 30;

export const DateRangeModal = ({
  open,
  onOpenChange,
  onConfirm,
  startDate: initialStartDate,
  endDate: initialEndDate
}: DateRangeModalProps) => {
  const [step, setStep] = useState<"start" | "end">("start");
  const [startDate, setStartDate] = useState<Date | undefined>(initialStartDate);
  const [endDate, setEndDate] = useState<Date | undefined>(initialEndDate);
  const [error, setError] = useState<string>("");

  const handleStartDateSelect = (date: Date | undefined) => {
    if (!date) return;

    setStartDate(date);
    setEndDate(undefined);
    setError("");
    setStep("end");
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    if (!date || !startDate) return;

    const nights = differenceInDays(date, startDate);

    if (nights < MIN_NIGHTS) {
      setError(`Thời gian đặt phòng tối thiểu là ${MIN_NIGHTS} đêm`);
      return;
    }

    if (nights > MAX_NIGHTS) {
      setError(`Thời gian đặt phòng tối đa là ${MAX_NIGHTS} đêm`);
      return;
    }

    setEndDate(date);
    setError("");
  };

  const handleConfirm = () => {
    if (startDate && endDate) {
      onConfirm(startDate, endDate);
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    setStep("start");
    setError("");
    onOpenChange(false);
  };

  const canConfirm = startDate && endDate && !error;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: '-50%', y: 'calc(-50% + 20px)' }}
            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
            exit={{ opacity: 0, scale: 0.95, x: '-50%', y: 'calc(-50% + 20px)' }}
            className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md"
          >
            <div className="bg-card rounded-2xl shadow-2xl border p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Chọn Ngày Đặt Phòng
                  </h2>
                  <motion.p
                    key={step}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-sm text-muted-foreground mt-1 flex items-center gap-2"
                  >
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold">
                      {step === "start" ? "1" : "2"}
                    </span>
                    {step === "start" ? "Chọn ngày nhận phòng" : "Chọn ngày trả phòng"}
                  </motion.p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-accent"
                      initial={{ width: "50%" }}
                      animate={{ width: step === "start" ? "50%" : "100%" }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {step === "start" ? "50%" : "100%"}
                  </span>
                </div>
              </div>

              {/* Selected Dates Display */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className={`p-3 rounded-lg border-2 transition-all ${step === "start" ? "border-primary bg-primary/5 shadow-sm" : "border-border"
                  }`}>
                  <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <CalendarIcon className="h-3 w-3" />
                    Ngày nhận phòng
                  </div>
                  <div className="font-semibold text-sm">
                    {startDate ? format(startDate, "dd/MM/yyyy") : "Chưa chọn"}
                  </div>
                </div>
                <div className={`p-3 rounded-lg border-2 transition-all ${step === "end" ? "border-primary bg-primary/5 shadow-sm" : "border-border"
                  }`}>
                  <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <CalendarIcon className="h-3 w-3" />
                    Ngày trả phòng
                  </div>
                  <div className="font-semibold text-sm">
                    {endDate ? format(endDate, "dd/MM/yyyy") : "Chưa chọn"}
                  </div>
                </div>
              </div>

              {/* Calendar */}
              <motion.div
                key={step}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="flex justify-center mb-4"
              >
                <Calendar
                  mode="single"
                  selected={step === "start" ? startDate : endDate}
                  onSelect={step === "start" ? handleStartDateSelect : handleEndDateSelect}
                  disabled={(date) => {
                    // Không cho chọn ngày quá khứ
                    if (date < new Date(new Date().setHours(0, 0, 0, 0))) {
                      return true;
                    }

                    // Khi chọn end date, chỉ cho phép chọn từ startDate + MIN_NIGHTS đến startDate + MAX_NIGHTS
                    if (step === "end" && startDate) {
                      const minEndDate = addDays(startDate, MIN_NIGHTS);
                      const maxEndDate = addDays(startDate, MAX_NIGHTS);
                      return date < minEndDate || date > maxEndDate;
                    }

                    return false;
                  }}
                  initialFocus
                  className="pointer-events-auto"
                />
              </motion.div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg"
                >
                  <p className="text-sm text-destructive font-medium">{error}</p>
                </motion.div>
              )}

              {/* Info Message */}
              {step === "end" && startDate && !error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-4 bg-primary/10 border border-primary/20 rounded-lg"
                >
                  <p className="text-sm text-primary font-medium flex items-start gap-2">
                    <CalendarIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>
                      Vui lòng chọn ngày trả phòng từ <strong>{format(addDays(startDate, MIN_NIGHTS), "dd/MM/yyyy")}</strong> đến <strong>{format(addDays(startDate, MAX_NIGHTS), "dd/MM/yyyy")}</strong>
                      <br />
                      <span className="text-xs opacity-80">(Tối thiểu {MIN_NIGHTS} đêm, tối đa {MAX_NIGHTS} đêm)</span>
                    </span>
                  </p>
                </motion.div>
              )}

              {/* Success Message after selecting start date */}
              {step === "end" && startDate && !endDate && !error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
                >
                  <p className="text-sm text-green-700 dark:text-green-400 font-medium text-center">
                    Ngày nhận phòng đã được chọn. Hãy chọn ngày trả phòng.
                  </p>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                {step === "end" && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      onClick={() => {
                        setStep("start");
                        setEndDate(undefined);
                        setError("");
                      }}
                      className="w-full hover:bg-accent/50 transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Quay lại
                    </Button>
                  </motion.div>
                )}
                <Button
                  onClick={handleConfirm}
                  disabled={!canConfirm}
                  className={`flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all ${!canConfirm ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg hover:scale-[1.02]"
                    }`}
                >
                  {step === "start" && !startDate ? "Chọn ngày bắt đầu" :
                    step === "end" && !endDate ? "Chọn ngày kết thúc" : "Xác nhận"}
                </Button>
              </div>

              {/* Duration Info */}
              {startDate && endDate && !error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 text-center bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20"
                >
                  <p className="text-xs text-muted-foreground mb-1">Tổng thời gian lưu trú</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {differenceInDays(endDate, startDate)} đêm
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Từ {format(startDate, "dd/MM")} đến {format(endDate, "dd/MM/yyyy")}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
