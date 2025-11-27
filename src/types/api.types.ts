// TypeScript types matching backend Java DTOs

// Generic API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// Room related types
export interface RoomTypeResponse {
  id: string;
  name: string;
  description: string;
  pricePerNight: number;
}

export interface RoomStatusResponse {
  id: string;
  name: string;
}

export interface RoomImageResponse {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
}

export interface RoomResponse {
  id: string;
  roomNumber: string;
  roomType: RoomTypeResponse;
  roomStatus: RoomStatusResponse;
  floor: number;
  note: string;
  images: RoomImageResponse[];
}

export interface RoomRequest {
  roomNumber: string;
  roomTypeId: string;
  roomStatusId?: string;
  floor: number;
  note?: string;
}

// Guest related types
export interface GuestResponse {
  id: string;
  fullName: string;
  keycloakUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface GuestRequest {
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  password: string;
  keycloakUserId?: string;
}

// Frontend specific types (for mapping)
export interface Room {
  id: number | string;
  number: string;
  type: string;
  price: number;
  status: string;
  floor: number;
  size?: string;
  capacity?: number;
  description?: string;
  amenities?: string[];
  lastBooking?: string;
}

export interface Customer {
  type: 'guest' | 'registered';
  id: string;
  name: string;
  email: string;
  phone: string;
  totalBookings?: number;
  lastBooking?: string;
  totalSpent?: number;
  createdAt?: string;
}
