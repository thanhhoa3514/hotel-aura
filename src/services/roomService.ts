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
     * Create a new room with images
     * @param roomData - Room data from form
     * @param images - Array of image files
     * @param imageOrder - Order of images
     */
    async createRoomWithImages(
        roomData: {
            roomNumber: string;
            roomTypeId: string;
            roomStatusId?: string;
            floor: number;
            note?: string;
        },
        images?: File[],
        imageOrder?: string[]
    ): Promise<RoomResponse> {
        const formData = new FormData();

        // Append room data as JSON
        formData.append('room', new Blob([JSON.stringify(roomData)], { type: 'application/json' }));

        // Append images if any
        if (images && images.length > 0) {
            images.forEach((image) => {
                formData.append('images', image);
            });
        }

        // Append image order if provided
        if (imageOrder && imageOrder.length > 0) {
            formData.append('imageOrder', new Blob([JSON.stringify(imageOrder)], { type: 'application/json' }));
        }

        const response = await apiClient.post<ApiResponse<RoomResponse>>(
            '/api/v1/rooms',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data.data;
    },

    /**
     * Update an existing room with new images
     */
    async updateRoomWithImages(
        id: string,
        roomData: {
            roomNumber: string;
            roomTypeId: string;
            roomStatusId?: string;
            floor: number;
            note?: string;
        },
        newImages?: File[],
        imageOrder?: string[]
    ): Promise<RoomResponse> {
        const formData = new FormData();

        // Append room data as JSON
        formData.append('room', new Blob([JSON.stringify(roomData)], { type: 'application/json' }));

        // Append new images if any
        if (newImages && newImages.length > 0) {
            newImages.forEach((image) => {
                formData.append('newImages', image);
            });
        }

        // Append image order if provided
        if (imageOrder && imageOrder.length > 0) {
            formData.append('imageOrder', new Blob([JSON.stringify(imageOrder)], { type: 'application/json' }));
        }

        const response = await apiClient.put<ApiResponse<RoomResponse>>(
            `/api/v1/rooms/${id}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data.data;
    },

    /**
     * Create a new room (without images)
     */
    async createRoom(request: RoomRequest): Promise<RoomResponse> {
        const response = await apiClient.post<ApiResponse<RoomResponse>>('/api/v1/rooms', request);
        return response.data.data;
    },

    /**
     * Update an existing room (without images)
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
