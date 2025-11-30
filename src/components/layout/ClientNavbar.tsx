import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ClientNavbarProps {
    onBookingClick?: () => void;
    currentPage?: "home" | "rooms";
}

export function ClientNavbar({ onBookingClick, currentPage = "home" }: ClientNavbarProps) {
    const navigate = useNavigate();

    const handleBookingClick = () => {
        if (onBookingClick) {
            onBookingClick();
        } else {
            navigate("/");
        }
    };

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="sticky top-0 z-50 backdrop-blur-md bg-card/80 border-b"
        >
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                <button onClick={() => navigate("/")} className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                        <span className="text-lg font-bold text-white">HP</span>
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        HotelPro
                    </span>
                </button>

                <nav className="hidden md:flex items-center gap-8">
                    <button
                        onClick={() => navigate("/")}
                        className={`transition-colors ${currentPage === "home"
                                ? "text-foreground font-semibold"
                                : "text-foreground/80 hover:text-foreground"
                            }`}
                    >
                        Trang chủ
                    </button>
                    <button
                        onClick={() => navigate("/rooms")}
                        className={`transition-colors ${currentPage === "rooms"
                                ? "text-foreground font-semibold"
                                : "text-foreground/80 hover:text-foreground"
                            }`}
                    >
                        Phòng
                    </button>
                </nav>

                <Button
                    onClick={handleBookingClick}
                    className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                >
                    Đặt phòng
                </Button>
            </div>
        </motion.header>
    );
}

