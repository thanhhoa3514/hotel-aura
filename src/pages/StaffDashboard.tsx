import { useEffect, useState } from "react";
import { Calendar, Users, Clock, CheckCircle } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface Booking {
  id: string;
  guest_name: string;
  room_number: string;
  check_in_date: string;
  status: string;
}

const StaffDashboard = () => {
  const [todayCheckIns, setTodayCheckIns] = useState<Booking[]>([]);
  const [stats, setStats] = useState({
    pendingBookings: 0,
    todayCheckIns: 0,
    checkedIn: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const today = new Date().toISOString().split('T')[0];
    
    // Fetch today's check-ins
    const { data: checkIns } = await supabase
      .from('bookings')
      .select('*')
      .eq('check_in_date', today)
      .order('created_at', { ascending: false });

    if (checkIns) {
      setTodayCheckIns(checkIns);
    }

    // Fetch stats
    const { data: pending } = await supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending');

    const { data: confirmed } = await supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'confirmed')
      .eq('check_in_date', today);

    const { data: checkedIn } = await supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'checked-in');

    setStats({
      pendingBookings: pending?.length || 0,
      todayCheckIns: confirmed?.length || 0,
      checkedIn: checkedIn?.length || 0,
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      confirmed: "default",
      "checked-in": "default",
      "checked-out": "outline",
    };
    return variants[status] || "default";
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Nhân viên</h1>
        <p className="text-muted-foreground mt-2">Quản lý booking và check-in</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Chờ xác nhận"
          value={stats.pendingBookings}
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="Check-in hôm nay"
          value={stats.todayCheckIns}
          icon={Calendar}
          variant="primary"
        />
        <StatCard
          title="Đang ở"
          value={stats.checkedIn}
          icon={CheckCircle}
          variant="success"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Check-in hôm nay
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todayCheckIns.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Không có check-in nào hôm nay
              </p>
            ) : (
              todayCheckIns.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{booking.guest_name}</p>
                    <p className="text-sm text-muted-foreground">
                      Phòng {booking.room_number}
                    </p>
                  </div>
                  <Badge variant={getStatusBadge(booking.status)}>
                    {booking.status === 'pending' && 'Chờ xác nhận'}
                    {booking.status === 'confirmed' && 'Đã xác nhận'}
                    {booking.status === 'checked-in' && 'Đã check-in'}
                    {booking.status === 'checked-out' && 'Đã check-out'}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffDashboard;
