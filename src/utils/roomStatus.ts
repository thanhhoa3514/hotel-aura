// Room status utilities

export type RoomStatusName = 'AVAILABLE' | 'OCCUPIED' | 'CLEANING' | 'MAINTENANCE';

export interface StatusMapItem {
    label: string;
    variant: 'default' | 'secondary' | 'outline' | 'destructive';
}

export const ROOM_STATUS_MAP: Record<RoomStatusName, StatusMapItem> = {
    AVAILABLE: { label: "Trống", variant: "default" },
    OCCUPIED: { label: "Đã đặt", variant: "secondary" },
    CLEANING: { label: "Đang dọn", variant: "outline" },
    MAINTENANCE: { label: "Bảo trì", variant: "destructive" },
};

/**
 * Get status display info from status name
 */
export function getRoomStatusInfo(statusName: string): StatusMapItem {
    return ROOM_STATUS_MAP[statusName as RoomStatusName] || {
        label: statusName,
        variant: "default",
    };
}

/**
 * Get all available room statuses for select options
 */
export function getRoomStatusOptions() {
    return Object.entries(ROOM_STATUS_MAP).map(([value, { label }]) => ({
        value,
        label,
    }));
}

