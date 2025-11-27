import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import StaffDashboard from "./pages/StaffDashboard";
import Rooms from "./pages/Rooms";
import Bookings from "./pages/Bookings";
import Customers from "./pages/Customers";
import Services from "./pages/Services";
import BookingLanding from "./pages/BookingLanding";
import ClientRooms from "./pages/ClientRooms";
import RoomDetail from "./pages/RoomDetail";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import { useUserRole } from "@/hooks/useUserRole";
import ChatButton from "./components/chat/ChatButton";



const Layout = ({ children }: { children: React.ReactNode }) => {
  const { role, loading } = useUserRole();

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <Header />
      <div className="flex w-full">
        <Sidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BookingLanding />} />
          <Route path="/rooms" element={<ClientRooms />} />
          <Route path="/rooms/:id" element={<RoomDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<Layout><Dashboard /></Layout>} />
          <Route path="/staff" element={<Layout><StaffDashboard /></Layout>} />
          <Route path="/admin/rooms" element={<Layout><Rooms /></Layout>} />
          <Route path="/admin/bookings" element={<Layout><Bookings /></Layout>} />
          <Route path="/staff/bookings" element={<Layout><Bookings /></Layout>} />
          <Route path="/admin/customers" element={<Layout><Customers /></Layout>} />
          <Route path="/admin/services" element={<Layout><Services /></Layout>} />
          <Route path="/admin/invoices" element={<Layout><div className="animate-fade-in"><h1 className="text-3xl font-bold">Hóa đơn</h1><p className="text-muted-foreground mt-2">Tính năng đang phát triển...</p></div></Layout>} />
          <Route path="/admin/statistics" element={<Layout><div className="animate-fade-in"><h1 className="text-3xl font-bold">Thống kê</h1><p className="text-muted-foreground mt-2">Tính năng đang phát triển...</p></div></Layout>} />
          <Route path="/admin/settings" element={<Layout><div className="animate-fade-in"><h1 className="text-3xl font-bold">Cài đặt</h1><p className="text-muted-foreground mt-2">Tính năng đang phát triển...</p></div></Layout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ChatButton />
      </BrowserRouter>
    </TooltipProvider>
  </ThemeProvider>
);

export default App;
