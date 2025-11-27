import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Bed,
  Calendar,
  Users,
  Utensils,
  Receipt,
  BarChart3,
  Settings,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Bed, label: "Quản lý phòng", path: "/admin/rooms" },
  { icon: Calendar, label: "Đặt phòng", path: "/admin/bookings" },
  { icon: Users, label: "Khách hàng", path: "/admin/customers" },
  { icon: Utensils, label: "Dịch vụ", path: "/admin/services" },
  { icon: Receipt, label: "Hóa đơn", path: "/admin/invoices" },
  { icon: BarChart3, label: "Thống kê", path: "/admin/statistics" },
  { icon: Settings, label: "Cài đặt", path: "/admin/settings" },
];

export const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "sticky top-16 h-[calc(100vh-4rem)] border-r bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-end p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="hover:bg-muted"
          >
            <ChevronLeft
              className={cn(
                "h-5 w-5 transition-transform",
                collapsed && "rotate-180"
              )}
            />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link key={item.path} to={item.path}>
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all hover:bg-muted",
                    isActive && "bg-primary text-primary-foreground hover:bg-primary/90",
                    collapsed && "justify-center"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <p className={cn("text-xs text-muted-foreground text-center", collapsed && "hidden")}>
            © 2025 HotelPro
          </p>
        </div>
      </div>
    </aside>
  );
};
