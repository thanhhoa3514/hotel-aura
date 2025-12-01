import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ClientNavbar } from "@/components/layout/ClientNavbar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export function Profile() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        if (user) {
            setFormData({
                fullName: user.fullName || "",
                email: user.email || "",
                phone: user.phone || "",
                address: user.address || "",
            });
        }
    }, [isAuthenticated, user, navigate]);

    const handleSave = async () => {
        try {
            toast.success("Cập nhật thông tin thành công");
            setIsEditing(false);
        } catch (error) {
            toast.error("Không thể cập nhật thông tin");
        }
    };

    const handleCancel = () => {
        if (user) {
            setFormData({
                fullName: user.fullName || "",
                email: user.email || "",
                phone: user.phone || "",
                address: user.address || "",
            });
        }
        setIsEditing(false);
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-background">
                <ClientNavbar currentPage="profile" />
                <div className="container mx-auto px-6 py-12">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <ClientNavbar currentPage="profile" />

            <div className="container mx-auto px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto space-y-8"
                >
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Thông tin cá nhân</h1>
                        <p className="text-muted-foreground">Quản lý thông tin tài khoản của bạn</p>
                    </div>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-20 w-20 border-4 border-primary/20">
                                    <AvatarImage src={user.avatar} alt={user.fullName} />
                                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-2xl font-bold">
                                        {getInitials(user.fullName)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-2xl">{user.fullName}</CardTitle>
                                    <CardDescription>{user.email}</CardDescription>
                                </div>
                            </div>
                            {!isEditing ? (
                                <Button onClick={() => setIsEditing(true)} className="gap-2">
                                    <Edit2 className="h-4 w-4" />
                                    Chỉnh sửa
                                </Button>
                            ) : (
                                <div className="flex gap-2">
                                    <Button onClick={handleSave} className="gap-2">
                                        <Save className="h-4 w-4" />
                                        Lưu
                                    </Button>
                                    <Button variant="outline" onClick={handleCancel} className="gap-2">
                                        <X className="h-4 w-4" />
                                        Hủy
                                    </Button>
                                </div>
                            )}
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName" className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Họ và tên
                                    </Label>
                                    <Input
                                        id="fullName"
                                        value={formData.fullName}
                                        onChange={(e) =>
                                            setFormData({ ...formData, fullName: e.target.value })
                                        }
                                        disabled={!isEditing}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        disabled={!isEditing}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        Số điện thoại
                                    </Label>
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        disabled={!isEditing}
                                        placeholder="Chưa có thông tin"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address" className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        Địa chỉ
                                    </Label>
                                    <Input
                                        id="address"
                                        value={formData.address}
                                        onChange={(e) =>
                                            setFormData({ ...formData, address: e.target.value })
                                        }
                                        disabled={!isEditing}
                                        placeholder="Chưa có thông tin"
                                    />
                                </div>
                            </div>

                            <div className="pt-6 border-t">
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Thông tin tài khoản
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <div className="text-muted-foreground">Ngày tạo tài khoản</div>
                                        <div className="font-medium">
                                            {user.createdAt
                                                ? format(new Date(user.createdAt), "dd/MM/yyyy", {
                                                    locale: vi,
                                                })
                                                : "Không có thông tin"}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-muted-foreground">Vai trò</div>
                                        <div className="font-medium">
                                            {user.roles?.join(", ") || "Khách hàng"}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-muted-foreground">ID Keycloak</div>
                                        <div className="font-mono text-xs">
                                            {user.keycloakUserId || "Không có"}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-muted-foreground">Trạng thái</div>
                                        <div className="font-medium text-green-600">Đang hoạt động</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Bảo mật</CardTitle>
                            <CardDescription>Quản lý mật khẩu và bảo mật tài khoản</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline">Đổi mật khẩu</Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}

