import apiClient from './apiClient';
import { GuestResponse, GuestRequest } from '@/types/api.types';

/**
 * Guest Service - Handles all guest-related API calls
 */
export const guestService = {
    /**
     * Get all guests
     */
    async getAllGuests(): Promise<GuestResponse[]> {
        const response = await apiClient.get<GuestResponse[]>('/api/v1/guests');
        return response.data;
    },

    /**
     * Get guest by ID
     */
    async getGuestById(id: string): Promise<GuestResponse> {
        const response = await apiClient.get<GuestResponse>(`/api/v1/guests/${id}`);
        return response.data;
    },

    /**
     * Get guest by email
     */
    async getGuestByEmail(email: string): Promise<GuestResponse> {
        const response = await apiClient.get<GuestResponse>(`/api/v1/guests/email/${email}`);
        return response.data;
    },

    /**
     * Get guest by Keycloak user ID
     */
    async getGuestByKeycloakUserId(keycloakUserId: string): Promise<GuestResponse> {
        const response = await apiClient.get<GuestResponse>(`/api/v1/guests/keycloak/${keycloakUserId}`);
        return response.data;
    },

    /**
     * Create a new guest
     */
    async createGuest(request: GuestRequest): Promise<GuestResponse> {
        const response = await apiClient.post<GuestResponse>('/api/v1/guests', request);
        return response.data;
    },

    /**
     * Update an existing guest
     */
    async updateGuest(id: string, request: GuestRequest): Promise<GuestResponse> {
        const response = await apiClient.put<GuestResponse>(`/api/v1/guests/${id}`, request);
        return response.data;
    },

    /**
     * Delete a guest
     */
    async deleteGuest(id: string): Promise<void> {
        await apiClient.delete(`/api/v1/guests/${id}`);
    },
};
