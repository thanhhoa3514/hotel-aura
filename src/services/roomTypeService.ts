import apiClient from './apiClient';
import { ApiResponse } from '@/types';

export interface RoomTypeResponse {
    id: string; // UUID from backend, received as string in JSON
    name: string;
    description: string;
    pricePerNight: string; // BigDecimal from backend, received as string in JSON
    capacity: number;
    size: string; // BigDecimal from backend, received as string in JSON
}

/**
 * Room Type Service - Handles all room type-related API calls
 */
export const roomTypeService = {
    /**
     * Get all room types
     */
    async getAllRoomTypes(): Promise<RoomTypeResponse[]> {
        const response = await apiClient.get<ApiResponse<RoomTypeResponse[]>>('/api/v1/room-types');
        return response.data.data;
    },

    /**
     * Get room type by ID
     */
    async getRoomTypeById(id: string): Promise<RoomTypeResponse> {
        const response = await apiClient.get<ApiResponse<RoomTypeResponse>>(`/api/v1/room-types/${id}`);
        return response.data.data;
    },

    /**
     * Get room type by name
     */
    async getRoomTypeByName(name: string): Promise<RoomTypeResponse | null> {
        const allTypes = await this.getAllRoomTypes();
        return allTypes.find(type => type.name.toLowerCase() === name.toLowerCase()) || null;
    }
};

export default roomTypeService;

