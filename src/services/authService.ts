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
    const response = await apiClient.post<{ data: AuthResponse }>(
      "/api/v1/auth/login",
      data
    );

    return response.data.data.user;
  },

  async register(data: RegisterData): Promise<UserInfo> {
    const response = await apiClient.post<{ data: AuthResponse }>(
      "/api/v1/auth/register",
      data
    );

    return response.data.data.user;
  },

  async logout(): Promise<void> {
    await apiClient.post("/api/v1/auth/logout");
  },

  async getCurrentUser(): Promise<UserInfo | null> {
    try {
      const response = await apiClient.get<{ data: UserInfo }>(
        "/api/v1/auth/me"
      );
      return response.data.data;
    } catch (error) {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return true; // Placeholder
  },
};

export default authService;
