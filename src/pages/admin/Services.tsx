import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Search, Sparkles, Coffee, Car, Music, Briefcase, Star, Loader2 } from "lucide-react";
import { AddServiceModal } from "@/components/services/AddServiceModal";
import { ServiceDetailModal } from "@/components/services/ServiceDetailModal";
import { Badge } from "@/components/ui/badge";

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  icon: string | null;
  is_active: boolean;
}

const iconMap: Record<string, any> = {
  Sparkles,
  Coffee,
  Car,
  Music,
  Briefcase,
  Star,
};

const Services = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setServices(data || []);
      setFilteredServices(data || []);
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    const filtered = services.filter(
      (service) =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredServices(filtered);
  }, [searchQuery, services]);

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Quản Lý Dịch Vụ
            </h1>
            <p className="text-muted-foreground mt-2">
              Quản lý các dịch vụ khách sạn
            </p>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            size="lg"
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            <Plus className="h-5 w-5 mr-2" />
            Thêm dịch vụ
          </Button>
        </div>

        {/* Search Bar */}
        <Card className="p-4 backdrop-blur-sm bg-card/80 border-primary/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên hoặc danh mục..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50"
            />
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 backdrop-blur-sm bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng dịch vụ</p>
                <p className="text-3xl font-bold mt-1">{services.length}</p>
              </div>
              <Star className="h-10 w-10 text-primary/60" />
            </div>
          </Card>

          <Card className="p-6 backdrop-blur-sm bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Đang hoạt động</p>
                <p className="text-3xl font-bold mt-1">
                  {services.filter((s) => s.is_active).length}
                </p>
              </div>
              <Sparkles className="h-10 w-10 text-green-500/60" />
            </div>
          </Card>

          <Card className="p-6 backdrop-blur-sm bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tạm ngưng</p>
                <p className="text-3xl font-bold mt-1">
                  {services.filter((s) => !s.is_active).length}
                </p>
              </div>
              <Coffee className="h-10 w-10 text-orange-500/60" />
            </div>
          </Card>

          <Card className="p-6 backdrop-blur-sm bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Danh mục</p>
                <p className="text-3xl font-bold mt-1">
                  {new Set(services.map((s) => s.category)).size}
                </p>
              </div>
              <Briefcase className="h-10 w-10 text-purple-500/60" />
            </div>
          </Card>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <Card className="p-12 text-center backdrop-blur-sm bg-card/50">
            <Sparkles className="h-16 w-16 mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-xl text-muted-foreground">
              {searchQuery ? "Không tìm thấy dịch vụ nào" : "Chưa có dịch vụ nào"}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => setShowAddModal(true)}
                variant="outline"
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm dịch vụ đầu tiên
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => {
              const IconComponent = iconMap[service.icon || "Star"] || Star;
              
              return (
                <Card
                  key={service.id}
                  className="group relative overflow-hidden backdrop-blur-sm bg-card/80 border-primary/10 hover:border-primary/30 hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => handleServiceClick(service)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <Badge
                        variant={service.is_active ? "default" : "secondary"}
                        className={service.is_active ? "bg-green-500/20 text-green-700 dark:text-green-400" : ""}
                      >
                        {service.is_active ? "Hoạt động" : "Tạm ngưng"}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {service.category}
                      </p>
                    </div>

                    {service.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {service.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <p className="text-sm text-muted-foreground">Giá dịch vụ</p>
                        <p className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                          {service.price.toLocaleString('vi-VN')} ₫
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <AddServiceModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSuccess={fetchServices}
      />

      <ServiceDetailModal
        open={!!selectedService}
        onOpenChange={(open) => !open && setSelectedService(null)}
        service={selectedService}
        onSuccess={fetchServices}
      />
    </div>
  );
};

export default Services;
