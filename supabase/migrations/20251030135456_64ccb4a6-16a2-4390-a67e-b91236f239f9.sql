-- Create room_images table for storing multiple images per room
CREATE TABLE public.room_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.room_images ENABLE ROW LEVEL SECURITY;

-- Create policies for room_images
CREATE POLICY "Anyone can view room images"
  ON public.room_images
  FOR SELECT
  USING (true);

CREATE POLICY "Staff and admins can insert room images"
  ON public.room_images
  FOR INSERT
  WITH CHECK (
    has_role(auth.uid(), 'admin'::app_role) OR 
    has_role(auth.uid(), 'staff'::app_role)
  );

CREATE POLICY "Staff and admins can update room images"
  ON public.room_images
  FOR UPDATE
  USING (
    has_role(auth.uid(), 'admin'::app_role) OR 
    has_role(auth.uid(), 'staff'::app_role)
  );

CREATE POLICY "Staff and admins can delete room images"
  ON public.room_images
  FOR DELETE
  USING (
    has_role(auth.uid(), 'admin'::app_role) OR 
    has_role(auth.uid(), 'staff'::app_role)
  );

-- Create index for better query performance
CREATE INDEX idx_room_images_room_id ON public.room_images(room_id);
CREATE INDEX idx_room_images_display_order ON public.room_images(room_id, display_order);

-- Insert sample images for existing rooms
INSERT INTO public.room_images (room_id, image_url, display_order)
SELECT 
  id,
  image_url,
  0
FROM public.rooms
WHERE image_url IS NOT NULL;

-- Add more sample images for variety
INSERT INTO public.room_images (room_id, image_url, display_order)
SELECT 
  id,
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
  1
FROM public.rooms
WHERE room_type LIKE '%Deluxe%';

INSERT INTO public.room_images (room_id, image_url, display_order)
SELECT 
  id,
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
  2
FROM public.rooms
WHERE room_type LIKE '%Suite%';