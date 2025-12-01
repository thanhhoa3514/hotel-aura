import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import authService, { UserInfo } from '@/services/authService';
import { toast } from 'sonner';

interface AuthContextType {
    user: UserInfo | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<UserInfo>;
    loginWithSocial: (provider: 'google' | 'facebook') => void;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const { keycloak, initialized } = useKeycloak();
    const [user, setUser] = useState<UserInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check authentication status on mount and when Keycloak initializes
    useEffect(() => {
        if (initialized) {
            checkAuth();
        }
    }, [initialized, keycloak.authenticated]);

    const checkAuth = async () => {
        try {
            setIsLoading(true);
            console.log('AuthContext - checkAuth started');
            console.log('AuthContext - keycloak.authenticated:', keycloak.authenticated);

            // If Keycloak is authenticated, user info will come from backend
            // Backend will validate Keycloak token and return user info
            if (keycloak.authenticated) {
                // User authenticated via Keycloak (social login)
                // The backend will handle JIT provisioning when we call APIs
                const currentUser = await authService.getCurrentUser();
                console.log('AuthContext - Keycloak user:', currentUser);
                setUser(currentUser);
            } else {
                // Check for traditional email/password login
                const currentUser = await authService.getCurrentUser();
                console.log('AuthContext - Traditional user:', currentUser);
                setUser(currentUser);
            }
        } catch (error) {
            console.error('AuthContext - checkAuth error:', error);
            setUser(null);
        } finally {
            setIsLoading(false);
            console.log('AuthContext - checkAuth finished');
        }
    };

    // Email/password login
    const login = async (email: string, password: string): Promise<UserInfo> => {
        try {
            const userInfo = await authService.login({ email, password });
            setUser(userInfo);
            toast.success(`Chào mừng ${userInfo.fullName}!`);
            return userInfo;  // Return userInfo for immediate use
        } catch (error: any) {
            // Error already handled by apiClient
            throw error;
        }
    };

    // Social login with Keycloak
    const loginWithSocial = (provider: 'google' | 'facebook') => {
        keycloak.login({
            idpHint: provider,
            redirectUri: window.location.origin,
        });
    };

    const logout = async () => {
        try {
            if (keycloak.authenticated) {
                // Logout from Keycloak
                keycloak.logout({ redirectUri: window.location.origin });
            } else {
                // Logout from traditional auth
                await authService.logout();
                toast.success('Đăng xuất thành công!');
            }
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
            setUser(null);
        }
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user || keycloak.authenticated,
        isLoading: isLoading || !initialized,
        login,
        loginWithSocial,
        logout,
        checkAuth,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
