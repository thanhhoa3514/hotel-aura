import apiClient from "./apiClient";

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
}

export interface UserInfo {
    id: string;
    fullName: string;
    email: string;
    role: string;
    keycloakUserId?: string;
    phone?: string;
    address?: string;
    avatar?: string;
    roles?: string[];
    createdAt?: string;
}

export interface AuthResponse {
    accessToken: string | null;
    tokenType: string;
    expiresIn: number;
    user: UserInfo;
}

const authService = {
    async login(data: LoginData): Promise<UserInfo> {
        const response = await apiClient.post<{ data: AuthResponse }>("/api/v1/auth/login", data);
        // JWT is automatically stored in httpOnly cookie by browser
        return response.data.data.user;
    },

    async register(data: RegisterData): Promise<UserInfo> {
        const response = await apiClient.post<{ data: AuthResponse }>("/api/v1/auth/register", data);
        // JWT is automatically stored in httpOnly cookie by browser
        return response.data.data.user;
    },

    async logout(): Promise<void> {
        await apiClient.post("/api/v1/auth/logout");
        // Cookie will be cleared by backend
    },

    async getCurrentUser(): Promise<UserInfo | null> {
        try {
            const response = await apiClient.get<{ data: UserInfo }>("/api/v1/auth/me");
            return response.data.data;
        } catch (error) {
            return null;
        }
    },

    isAuthenticated(): boolean {
        // With httpOnly cookies, we can't check from frontend
        // We'll check by calling /me endpoint
        return true; // Placeholder
    },
};

export default authService;
