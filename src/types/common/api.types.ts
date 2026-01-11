// Generic API Response wrapper
export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
    timestamp?: string;
    errorCode?: string;
}

// API Error response structure
export interface ApiError {
    message: string;
    errorCode?: string;
    detail?: string;
}

