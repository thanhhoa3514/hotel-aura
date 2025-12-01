import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, User, LogOut, Calendar, Settings } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ClientNavbarProps {
    onBookingClick?: () => void;
    currentPage?: "home" | "rooms" | "bookings" | "profile";
}

export function ClientNavbar({ onBookingClick, currentPage = "home" }: ClientNavbarProps) {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout, isLoading } = useAuth();

    const handleBookingClick = () => {
        if (onBookingClick) {
            onBookingClick();
        } else {
            navigate("/rooms");
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    const getInitials = (name: string) => {
        return name
            ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
            : "HP";
    };

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="sticky top-0 z-50 backdrop-blur-md bg-card/80 border-b"
        >
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo Section - Giữ nguyên */}
                <button onClick={() => navigate("/")} className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                        <span className="text-lg font-bold text-white">HP</span>
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hidden sm:inline-block">
                        HotelPro
                    </span>
                </button>

                {/* Navigation Links - Giữ nguyên */}
                <nav className="hidden md:flex items-center gap-8">
                    <button
                        onClick={() => navigate("/")}
                        className={`transition-colors ${currentPage === "home" ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}
                    >
                        Trang chủ
                    </button>
                    <button
                        onClick={() => navigate("/rooms")}
                        className={`transition-colors ${currentPage === "rooms" ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}
                    >
                        Phòng
                    </button>
                    {isAuthenticated && (
                        <button
                            onClick={() => navigate("/my-bookings")}
                            className={`transition-colors ${currentPage === "bookings" ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            Đặt phòng của tôi
                        </button>
                    )}
                </nav>

                {/* Actions Section */}
                <div className="flex items-center gap-4">
                    <Button
                        onClick={handleBookingClick}
                        className="bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-md"
                    >
                        Đặt phòng
                    </Button>

                    {isLoading ? (
                        <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                    ) : isAuthenticated && user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                {/* --- SỬA ĐỔI Ở ĐÂY: Chỉ hiển thị Avatar --- */}
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full focus-visible:ring-2 focus-visible:ring-primary">
                                    <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                                        <AvatarImage src={user.avatar} alt={user.fullName} className="object-cover" />
                                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                            {getInitials(user.fullName)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-60 p-2" forceMount>
                                {/* --- Header trong Menu: Hiển thị thông tin user --- */}
                                <div className="flex items-center gap-3 p-2">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user.fullName}</p>
                                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                    </div>
                                </div>
                                <DropdownMenuSeparator />

                                <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Thông tin cá nhân</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate("/my-bookings")} className="cursor-pointer">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    <span>Lịch sử đặt phòng</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer">
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Cài đặt</span>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer focus:text-destructive focus:bg-destructive/10">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Đăng xuất</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button
                            variant="outline"
                            onClick={() => navigate("/login")}
                            className="hidden sm:flex items-center gap-2 border-primary/20 hover:bg-primary/5"
                        >
                            <LogIn className="h-4 w-4" />
                            <span>Đăng nhập</span>
                        </Button>
                    )}
                </div>
            </div>
        </motion.header>
    );
}