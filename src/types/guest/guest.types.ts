// Guest related types matching backend DTOs

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

// Frontend legacy types (for backward compatibility)
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

