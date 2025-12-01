import apiClient from './apiClient';
import { ApiResponse } from '@/types';

export interface RoomStatusResponse {
    id: string; // UUID from backend, received as string in JSON
    name: string;
}

/**
 * Room Status Service - Handles all room status-related API calls
 */
export const roomStatusService = {
    /**
     * Get all room statuses
     */
    async getAllRoomStatuses(): Promise<RoomStatusResponse[]> {
        const response = await apiClient.get<ApiResponse<RoomStatusResponse[]>>('/api/v1/room-statuses');
        return response.data.data;
    },

    /**
     * Get room status by ID
     */
    async getRoomStatusById(id: string): Promise<RoomStatusResponse> {
        const response = await apiClient.get<ApiResponse<RoomStatusResponse>>(`/api/v1/room-statuses/${id}`);
        return response.data.data;
    },

    /**
     * Get room status by name
     */
    async getRoomStatusByName(name: string): Promise<RoomStatusResponse | null> {
        const allStatuses = await this.getAllRoomStatuses();
        return allStatuses.find(status => status.name.toLowerCase() === name.toLowerCase()) || null;
    }
};

export default roomStatusService;

