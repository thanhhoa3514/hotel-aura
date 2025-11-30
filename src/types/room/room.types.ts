// Room related types matching backend DTOs

export interface RoomTypeResponse {
    id: string;
    name: string;
    description: string;
    capacity?: number;
    size?: number;
    amenities?: string[];
    pricePerNight: number; // Backend sends BigDecimal as number in JSON
}

export interface RoomStatusResponse {
    id: string;
    name: string; // AVAILABLE, OCCUPIED, MAINTENANCE, CLEANING
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
    floor: number;
    note: string;
    status: RoomStatusResponse;
    capacity?: number;
    size?: number;
    images: RoomImageResponse[];
}

export interface RoomRequest {
    roomNumber: string;
    roomTypeId: string;
    roomStatusId?: string;
    floor: number;
    note?: string;
}

// Room availability types
export interface RoomAvailabilityRequest {
    roomIds?: string[];
    checkIn: string;
    checkOut: string;
}

export interface RoomAvailabilityDetail {
    roomId: string;
    roomNumber: string;
    available: boolean;
    roomType: string;
    pricePerNight: number;
}

export interface RoomAvailabilityResponse {
    allAvailable: boolean;
    rooms: RoomAvailabilityDetail[];
    checkIn: string;
    checkOut: string;
    nights: number;
    estimatedTotal: number;
}

// Frontend legacy types (for backward compatibility with admin components)
export interface Room {
    id: string;
    number: string;
    roomType: RoomTypeResponse;
    floor: number;

    note: string;
    status: RoomStatusResponse;
    capacity?: number;
    size?: number;
    amenities?: string[];
    description?: string;
    images: RoomImageResponse[];
    lastBooking?: string;
}

