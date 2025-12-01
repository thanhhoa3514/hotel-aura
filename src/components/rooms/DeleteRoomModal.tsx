import { useState, useEffect } from "react";
import { AlertTriangle, Loader2, XCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Room } from "@/types";
import { reservationService } from "@/services/reservationService";

interface DeleteRoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (roomId: string) => Promise<void>;
    room: Room | null;
}

export const DeleteRoomModal = ({ isOpen, onClose, onConfirm, room }: DeleteRoomModalProps) => {
    const [isChecking, setIsChecking] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [canDelete, setCanDelete] = useState<boolean | null>(null);
    const [activeReservations, setActiveReservations] = useState<number>(0);
    const [checkError, setCheckError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && room) {
            checkRoomReservations();
        } else {
            // Reset state when modal closes
            setCanDelete(null);
            setActiveReservations(0);
            setCheckError(null);
        }
    }, [isOpen, room]);

    const checkRoomReservations = async () => {
        if (!room) return;

        setIsChecking(true);
        setCheckError(null);

        try {
            // Check if room has any active reservations
            const response = await reservationService.checkRoomReservations(room.id);

            setActiveReservations(response.count);
            setCanDelete(!response.hasActiveReservations);
        } catch (error: any) {
            console.error("Error checking room reservations:", error);
            setCheckError(error.message || "Không thể kiểm tra đặt phòng");
            setCanDelete(false);
        } finally {
            setIsChecking(false);
        }
    };

    const handleDelete = async () => {
        if (!room || !canDelete) return;

        setIsDeleting(true);

        try {
            await onConfirm(room.id);

            toast({
                title: "Đã xóa phòng",
                description: `Phòng ${room.number} đã được xóa thành công`,
            });

            onClose();
        } catch (error: any) {
            console.error("Error deleting room:", error);

            toast({
                title: "Không thể xóa phòng",
                description: error.message || "Có lỗi xảy ra khi xóa phòng",
                variant: "destructive",
            });
        } finally {
            setIsDeleting(false);
        }
    };

    if (!room) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Xác nhận xóa phòng
                    </DialogTitle>
                    <DialogDescription>
                        Kiểm tra và xác nhận xóa phòng khỏi hệ thống
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Room Info */}
                    <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">Số phòng:</span>
                            <Badge variant="outline">{room.number}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">Loại phòng:</span>
                            <span className="text-sm">{room.roomType?.name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">Tầng:</span>
                            <span className="text-sm">{room.floor}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">Trạng thái:</span>
                            <Badge variant={room.status?.name === "AVAILABLE" ? "default" : "secondary"}>
                                {room.status?.name}
                            </Badge>
                        </div>
                    </div>

                    {/* Checking Status */}
                    {isChecking && (
                        <Alert>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <AlertDescription>
                                Đang kiểm tra đặt phòng...
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Check Error */}
                    {checkError && (
                        <Alert variant="destructive">
                            <XCircle className="h-4 w-4" />
                            <AlertDescription>{checkError}</AlertDescription>
                        </Alert>
                    )}

                    {/* Can Delete */}
                    {!isChecking && canDelete === true && (
                        <Alert className="border-green-500/50 bg-green-500/10">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <AlertDescription className="text-green-700 dark:text-green-400">
                                Phòng này không có đặt phòng nào đang hoạt động. Có thể xóa an toàn.
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Cannot Delete */}
                    {!isChecking && canDelete === false && !checkError && (
                        <Alert variant="destructive">
                            <XCircle className="h-4 w-4" />
                            <AlertDescription>
                                <div className="space-y-2">
                                    <p className="font-semibold">Không thể xóa phòng này!</p>
                                    <p>
                                        Phòng có <span className="font-bold">{activeReservations}</span> đặt phòng đang hoạt động
                                        (PENDING, CONFIRMED, hoặc CHECKED_IN).
                                    </p>
                                    <p className="text-sm">
                                        Vui lòng hủy hoặc hoàn thành các đặt phòng trước khi xóa phòng.
                                    </p>
                                </div>
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Warning Message */}
                    {canDelete && (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                                <p className="font-semibold mb-1">Cảnh báo:</p>
                                <p>Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan đến phòng sẽ bị xóa vĩnh viễn.</p>
                            </AlertDescription>
                        </Alert>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Hủy
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isChecking || !canDelete || isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Đang xóa...
                            </>
                        ) : (
                            "Xác nhận xóa"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

