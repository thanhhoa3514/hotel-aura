import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, User, Calendar, Mail } from "lucide-react";
import { toast } from "sonner";
import { guestService } from "@/services/guestService";
import { GuestResponse } from "@/types/api.types";

export default function Customers() {
  const [guests, setGuests] = useState<GuestResponse[]>([]);
  const [filteredGuests, setFilteredGuests] = useState<GuestResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuests();
  }, []);

  useEffect(() => {
    filterGuests();
  }, [searchTerm, guests]);

  const fetchGuests = async () => {
    try {
      setLoading(true);
      const data = await guestService.getAllGuests();
      setGuests(data);
      toast.success(`Đã tải ${data.length} khách hàng`);
    } catch (error) {
      console.error("Error fetching guests:", error);
      toast.error("Không thể tải dữ liệu khách hàng");
      setGuests([]);
    } finally {
      setLoading(false);
    }
  };

  const filterGuests = () => {
    let filtered = guests;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (guest) =>
          guest.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          guest.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredGuests(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý khách hàng</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý thông tin khách hàng
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng khách hàng</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{guests.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã đăng ký</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{guests.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoạt động</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{guests.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Danh sách khách hàng</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm khách hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-[300px]"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Đang tải...</div>
          ) : filteredGuests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Không tìm thấy khách hàng nào
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên khách hàng</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Keycloak User ID</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead>Cập nhật lần cuối</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGuests.map((guest) => (
                    <TableRow key={guest.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {guest.fullName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {guest.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">
                          {guest.keycloakUserId}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(guest.createdAt)}</TableCell>
                      <TableCell>{formatDate(guest.updatedAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
