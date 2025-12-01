import apiClient from './apiClient';
import {
    ApiResponse,
    ReservationRequest,
    ReservationResponse,
    RoomAvailabilityRequest,
    RoomAvailabilityResponse,
    RoomResponse,
} from '@/types/api.types';

/**
 * Reservation Service - Handles all reservation-related API calls
 */
export const reservationService = {
    /**
     * Create a new reservation
     */
    async createReservation(request: ReservationRequest): Promise<ReservationResponse> {
        const response = await apiClient.post<ApiResponse<ReservationResponse>>(
            '/api/v1/reservations',
            request
        );
        return response.data.data;
    },

    /**
     * Get reservation by ID
     */
    async getReservationById(id: string): Promise<ReservationResponse> {
        const response = await apiClient.get<ApiResponse<ReservationResponse>>(
            `/api/v1/reservations/${id}`
        );
        return response.data.data;
    },

    /**
     * Get all reservations
     */
    async getAllReservations(): Promise<ReservationResponse[]> {
        const response = await apiClient.get<ApiResponse<ReservationResponse[]>>(
            '/api/v1/reservations'
        );
        return response.data.data;
    },

    /**
     * Get reservations by guest's Keycloak user ID
     */
    async getReservationsByGuestId(keycloakUserId: string): Promise<ApiResponse<ReservationResponse[]>> {
        const response = await apiClient.get<ApiResponse<ReservationResponse[]>>(
            `/api/v1/reservations/guest/${keycloakUserId}`
        );
        return response.data;
    },

    /**
     * Get reservations by date range
     */
    async getReservationsByDateRange(startDate: string, endDate: string): Promise<ReservationResponse[]> {
        const response = await apiClient.get<ApiResponse<ReservationResponse[]>>(
            '/api/v1/reservations/date-range',
            { params: { startDate, endDate } }
        );
        return response.data.data;
    },

    /**
     * Update a reservation
     */
    async updateReservation(id: string, request: ReservationRequest): Promise<ReservationResponse> {
        const response = await apiClient.put<ApiResponse<ReservationResponse>>(
            `/api/v1/reservations/${id}`,
            request
        );
        return response.data.data;
    },

    /**
     * Add room to reservation
     */
    async addRoomToReservation(reservationId: string, roomId: string): Promise<ReservationResponse> {
        const response = await apiClient.post<ApiResponse<ReservationResponse>>(
            `/api/v1/reservations/${reservationId}/rooms/${roomId}`
        );
        return response.data.data;
    },

    /**
     * Remove room from reservation
     */
    async removeRoomFromReservation(reservationId: string, roomId: string): Promise<void> {
        await apiClient.delete(`/api/v1/reservations/${reservationId}/rooms/${roomId}`);
    },

    /**
     * Check in a reservation
     */
    async checkIn(id: string): Promise<ReservationResponse> {
        const response = await apiClient.post<ApiResponse<ReservationResponse>>(
            `/api/v1/reservations/${id}/check-in`
        );
        return response.data.data;
    },

    /**
     * Check out a reservation
     */
    async checkOut(id: string): Promise<ReservationResponse> {
        const response = await apiClient.post<ApiResponse<ReservationResponse>>(
            `/api/v1/reservations/${id}/check-out`
        );
        return response.data.data;
    },

    /**
     * Cancel a reservation
     */
    async cancelReservation(id: string): Promise<ReservationResponse> {
        const response = await apiClient.post<ApiResponse<ReservationResponse>>(
            `/api/v1/reservations/${id}/cancel`
        );
        return response.data.data;
    },

    /**
     * Delete a reservation (only cancelled reservations)
     */
    async deleteReservation(id: string): Promise<void> {
        await apiClient.delete(`/api/v1/reservations/${id}`);
    },

    /**
     * Check room availability for specific rooms
     */
    async checkRoomAvailability(request: RoomAvailabilityRequest): Promise<RoomAvailabilityResponse> {
        const response = await apiClient.post<ApiResponse<RoomAvailabilityResponse>>(
            '/api/v1/rooms/check-availability',
            request
        );
        return response.data.data;
    },

    /**
     * Get all available rooms for a date range
     */
    async getAvailableRooms(checkIn: string, checkOut: string): Promise<RoomResponse[]> {
        const response = await apiClient.get<ApiResponse<RoomResponse[]>>(
            '/api/v1/rooms/available',
            { params: { checkIn, checkOut } }
        );
        return response.data.data;
    },

    /**
     * Check if a room has active reservations
     * Returns count of active reservations (PENDING, CONFIRMED, CHECKED_IN)
     */
    async checkRoomReservations(roomId: string): Promise<{ hasActiveReservations: boolean; count: number }> {
        const response = await apiClient.get<ApiResponse<{ hasActiveReservations: boolean; count: number }>>(
            `/api/v1/reservations/room/${roomId}/active-count`
        );
        return response.data.data;
    },
};

export default reservationService;

