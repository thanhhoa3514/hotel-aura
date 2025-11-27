import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { Building2, Users, Calendar, DollarSign } from "lucide-react";

export default function Dashboard() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                    Tổng quan hệ thống quản lý khách sạn
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Tổng phòng"
                    value="120"
                    description="+10% so với tháng trước"
                    icon={Building2}
                />
                <StatCard
                    title="Khách hàng"
                    value="450"
                    description="+15% so với tháng trước"
                    icon={Users}
                />
                <StatCard
                    title="Đặt phòng"
                    value="89"
                    description="Trong tháng này"
                    icon={Calendar}
                />
                <StatCard
                    title="Doanh thu"
                    value="450M VNĐ"
                    description="+20% so với tháng trước"
                    icon={DollarSign}
                />
            </div>

            <RevenueChart />
        </div>
    );
}
