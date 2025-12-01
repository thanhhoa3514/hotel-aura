import apiClient from './apiClient';
import { ApiResponse } from '@/types';

/**
 * Room Image Service - Handles all room image-related API calls
 */
export const roomImageService = {
    /**
     * Upload images for a room
     */
    async uploadRoomImages(roomId: string, files: File[]): Promise<string[]> {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });

        const response = await apiClient.post<ApiResponse<string[]>>(
            `/api/v1/rooms/${roomId}/images`,
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
     * Delete a room image
     */
    async deleteRoomImage(roomId: string, imageId: string): Promise<void> {
        await apiClient.delete(`/api/v1/rooms/${roomId}/images/${imageId}`);
    },

    /**
     * Set an image as primary
     */
    async setPrimaryImage(roomId: string, imageId: string): Promise<void> {
        await apiClient.patch(`/api/v1/rooms/${roomId}/images/${imageId}/primary`);
    },

    /**
     * Validate image file before upload
     */
    validateImageFile(file: File): { valid: boolean; error?: string } {
        const MAX_SIZE = 5 * 1024 * 1024; // 5MB
        const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

        if (!ALLOWED_TYPES.includes(file.type)) {
            return {
                valid: false,
                error: 'Chỉ chấp nhận file ảnh (JPEG, PNG, WebP)'
            };
        }

        if (file.size > MAX_SIZE) {
            return {
                valid: false,
                error: `Kích thước file không được vượt quá ${MAX_SIZE / (1024 * 1024)}MB`
            };
        }

        return { valid: true };
    },

    /**
     * Validate multiple image files
     */
    validateImageFiles(files: File[]): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (files.length === 0) {
            errors.push('Vui lòng chọn ít nhất 1 ảnh');
        }

        if (files.length > 10) {
            errors.push('Chỉ được upload tối đa 10 ảnh');
        }

        files.forEach((file, index) => {
            const validation = this.validateImageFile(file);
            if (!validation.valid) {
                errors.push(`File ${index + 1}: ${validation.error}`);
            }
        });

        return {
            valid: errors.length === 0,
            errors
        };
    }
};

export default roomImageService;

