// Reservation related types matching backend DTOs

import { GuestResponse } from '../guest/guest.types';
import { RoomResponse } from '../room/room.types';

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED';

export interface ReservationRequest {
    keycloakUserId: string;
    roomIds: string[];
    checkIn: string; // ISO date string YYYY-MM-DD
    checkOut: string; // ISO date string YYYY-MM-DD
    status?: ReservationStatus;
}

export interface ReservationResponse {
    id: string;
    guest: GuestResponse;
    rooms: RoomResponse[];
    checkIn: string;
    checkOut: string;
    totalAmount: number;
    status: ReservationStatus;
    createdAt: string;
    updatedAt: string;
}

