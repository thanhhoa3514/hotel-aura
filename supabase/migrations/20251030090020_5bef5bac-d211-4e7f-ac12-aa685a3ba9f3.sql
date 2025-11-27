-- Create rooms table for hotel rooms
CREATE TABLE public.rooms (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_number text NOT NULL UNIQUE,
  room_type text NOT NULL,
  description text,
  price numeric NOT NULL,
  image_url text,
  floor integer,
  capacity integer NOT NULL DEFAULT 2,
  size numeric,
  amenities text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'available',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- Allow public to view available rooms
CREATE POLICY "Anyone can view rooms"
ON public.rooms
FOR SELECT
USING (true);

-- Only admins and staff can insert rooms
CREATE POLICY "Staff and admins can insert rooms"
ON public.rooms
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'staff'::app_role));

-- Only admins and staff can update rooms
CREATE POLICY "Staff and admins can update rooms"
ON public.rooms
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'staff'::app_role));

-- Only admins can delete rooms
CREATE POLICY "Only admins can delete rooms"
ON public.rooms
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_rooms_updated_at
BEFORE UPDATE ON public.rooms
FOR EACH ROW
EXECUTE FUNCTION public.update_bookings_updated_at();

-- Insert sample room data
INSERT INTO public.rooms (room_number, room_type, description, price, image_url, floor, capacity, size, amenities, status) VALUES
('101', 'Deluxe', 'Phòng deluxe với view biển tuyệt đẹp', 2500000, 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800', 1, 2, 35, ARRAY['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Sea View'], 'available'),
('102', 'Suite', 'Suite cao cấp với phòng khách riêng', 4500000, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', 1, 4, 60, ARRAY['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Kitchen', 'Balcony'], 'available'),
('201', 'Standard', 'Phòng tiêu chuẩn thoải mái', 1500000, 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800', 2, 2, 28, ARRAY['WiFi', 'TV', 'Air Conditioning'], 'occupied'),
('202', 'Deluxe', 'Phòng deluxe với giường king size', 2800000, 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800', 2, 2, 38, ARRAY['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'City View'], 'available'),
('301', 'Presidential', 'Phòng tổng thống sang trọng nhất', 8000000, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800', 3, 6, 120, ARRAY['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Kitchen', 'Balcony', 'Jacuzzi', 'Sea View'], 'available');