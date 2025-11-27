import { Bed, Users, DollarSign, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const recentCheckIns = [
  { id: 1, name: "Nguyễn Văn A", room: "201", time: "14:30", status: "confirmed" },
  { id: 2, name: "Trần Thị B", room: "305", time: "15:15", status: "pending" },
  { id: 3, name: "Lê Văn C", room: "102", time: "16:00", status: "confirmed" },
  { id: 4, name: "Phạm Thị D", room: "410", time: "16:45", status: "confirmed" },
];

const Dashboard = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Tổng quan hoạt động khách sạn</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Phòng trống"
          value="24"
          icon={Bed}
          trend={{ value: 12, label: "so với tuần trước" }}
          variant="primary"
        />
        <StatCard
          title="Khách đặt phòng"
          value="156"
          icon={Users}
          trend={{ value: 8, label: "so với tuần trước" }}
          variant="success"
        />
        <StatCard
          title="Doanh thu hôm nay"
          value="45.2M"
          icon={DollarSign}
          trend={{ value: -3, label: "so với hôm qua" }}
          variant="default"
        />
        <StatCard
          title="Tỷ lệ lấp đầy"
          value="87%"
          icon={TrendingUp}
          trend={{ value: 5, label: "so với tuần trước" }}
          variant="warning"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <RevenueChart />
        </div>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Check-in hôm nay</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCheckIns.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Phòng {item.room} • {item.time}
                    </p>
                  </div>
                  <Badge
                    variant={item.status === "confirmed" ? "default" : "secondary"}
                  >
                    {item.status === "confirmed" ? "Đã xác nhận" : "Chờ xử lý"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
