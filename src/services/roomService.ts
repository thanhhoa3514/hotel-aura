import apiClient from './apiClient';
import { RoomResponse, RoomRequest, ApiResponse } from '@/types/api.types';

/**
 * Room Service - Handles all room-related API calls
 */
export const roomService = {
    /**
     * Get all rooms
     */
    async getAllRooms(): Promise<RoomResponse[]> {
        const response = await apiClient.get<ApiResponse<RoomResponse[]>>('/api/v1/rooms');
        return response.data.data;
    },

    /**
     * Get room by ID
     */
    async getRoomById(id: string): Promise<RoomResponse | null> {
        const response = await apiClient.get<ApiResponse<RoomResponse>>(`/api/v1/rooms/${id}`);
        return response.data.data;
    },

    /**
     * Get rooms by status name
     */
    async getRoomsByStatus(statusName: string): Promise<RoomResponse[]> {
        const response = await apiClient.get<ApiResponse<RoomResponse[]>>(`/api/v1/rooms/status/${statusName}`);
        return response.data.data;
    },

    /**
     * Create a new room
     */
    async createRoom(request: RoomRequest): Promise<RoomResponse> {
        const response = await apiClient.post<ApiResponse<RoomResponse>>('/api/v1/rooms', request);
        return response.data.data;
    },

    /**
     * Update an existing room
     */
    async updateRoom(id: string, request: RoomRequest): Promise<RoomResponse> {
        const response = await apiClient.patch<ApiResponse<RoomResponse>>(`/api/v1/rooms/${id}`, request);
        return response.data.data;
    },

    /**
     * Delete a room
     */
    async deleteRoom(id: string): Promise<void> {
        await apiClient.delete(`/api/v1/rooms/${id}`);
    },
};
