// Reservation status utilities

import { ReservationStatus } from "@/types";

export interface StatusMapItem {
    label: string;
    variant: 'default' | 'secondary' | 'outline' | 'destructive';
    color?: string;
}

export const RESERVATION_STATUS_MAP: Record<ReservationStatus, StatusMapItem> = {
    PENDING: {
        label: "Chờ xác nhận",
        variant: "outline",
        color: "text-yellow-600"
    },
    CONFIRMED: {
        label: "Đã xác nhận",
        variant: "default",
        color: "text-orange-600"
    },
    CHECKED_IN: {
        label: "Đã check-in",
        variant: "secondary",
        color: "text-green-600"
    },
    CHECKED_OUT: {
        label: "Đã check-out",
        variant: "outline",
        color: "text-gray-600"
    },
    CANCELLED: {
        label: "Đã hủy",
        variant: "destructive",
        color: "text-red-600"
    },
};

/**
 * Get reservation status display info from status value
 */
export function getReservationStatusInfo(status: ReservationStatus): StatusMapItem {
    return RESERVATION_STATUS_MAP[status] || {
        label: status,
        variant: "default",
    };
}

/**
 * Get all available reservation statuses for select options
 */
export function getReservationStatusOptions() {
    return Object.entries(RESERVATION_STATUS_MAP).map(([value, { label }]) => ({
        value: value as ReservationStatus,
        label,
    }));
}

/**
 * Check if reservation can be cancelled
 */
export function canCancelReservation(status: ReservationStatus): boolean {
    return status === 'PENDING' || status === 'CONFIRMED';
}

/**
 * Check if reservation can be checked in
 */
export function canCheckIn(status: ReservationStatus): boolean {
    return status === 'CONFIRMED';
}

/**
 * Check if reservation can be checked out
 */
export function canCheckOut(status: ReservationStatus): boolean {
    return status === 'CHECKED_IN';
}

