// Admin room status utilities with color support

export type AdminRoomStatusName = 'AVAILABLE' | 'OCCUPIED' | 'CLEANING' | 'MAINTENANCE';

export interface AdminStatusMapItem {
    label: string;
    variant: 'default' | 'secondary' | 'outline' | 'destructive';
    color: string; // Tailwind classes for badge styling
}

export const ADMIN_ROOM_STATUS_MAP: Record<AdminRoomStatusName, AdminStatusMapItem> = {
    AVAILABLE: {
        label: "Trống",
        variant: "default",
        color: "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/50"
    },
    OCCUPIED: {
        label: "Đã đặt",
        variant: "secondary",
        color: "bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/50"
    },
    CLEANING: {
        label: "Đang dọn",
        variant: "outline",
        color: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/50"
    },
    MAINTENANCE: {
        label: "Bảo trì",
        variant: "destructive",
        color: "bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-500/50"
    },
};

/**
 * Get admin room status display info from status name
 */
export function getAdminRoomStatusInfo(statusName: string): AdminStatusMapItem {
    return ADMIN_ROOM_STATUS_MAP[statusName as AdminRoomStatusName] || {
        label: statusName,
        variant: "default",
        color: "bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-500/50"
    };
}

/**
 * Get all available room statuses for admin select options
 */
export function getAdminRoomStatusOptions() {
    return Object.entries(ADMIN_ROOM_STATUS_MAP).map(([value, { label }]) => ({
        value,
        label,
    }));
}

/**
 * Get status color classes for badge
 */
export function getAdminRoomStatusColor(statusName: string): string {
    return getAdminRoomStatusInfo(statusName).color;
}

/**
 * Get status label
 */
export function getAdminRoomStatusLabel(statusName: string): string {
    return getAdminRoomStatusInfo(statusName).label;
}

