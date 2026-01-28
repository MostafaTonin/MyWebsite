import axiosInstance from './axios';
import type { AuthResponse, User } from '../types/api';

export const authApi = {
    login: async (username: string, password: string): Promise<AuthResponse> => {
        const response = await axiosInstance.post<AuthResponse>('/Auth/login', {
            username,
            password,
        });
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('auth_user');
    },

    getCurrentUser: (): User | null => {
        const userStr = localStorage.getItem('auth_user');
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    },

    saveAuth: (authData: AuthResponse) => {
        localStorage.setItem('auth_token', authData.token);
        localStorage.setItem('refresh_token', authData.refreshToken);
        const user: User = {
            id: authData.id,
            username: authData.username,
            fullName: authData.fullName,
            token: authData.token,
            refreshToken: authData.refreshToken,
            roles: authData.roles,
        };
        localStorage.setItem('auth_user', JSON.stringify(user));
    },

    isAuthenticated: (): boolean => {
        const token = localStorage.getItem('auth_token');
        return !!token;
    },

    isAdmin: (): boolean => {
        const user = authApi.getCurrentUser();
        return user?.roles?.includes('Admin') || false;
    },

    // User Management
    getUsers: async (): Promise<User[]> => {
        const response = await axiosInstance.get<User[]>('/Auth/users');
        return response.data;
    },

    register: async (data: any): Promise<void> => {
        await axiosInstance.post('/Auth/register', data);
    },

    registerPublic: async (data: any): Promise<void> => {
        await axiosInstance.post('/Auth/register-public', data);
    },

    updateUser: async (id: number, data: any): Promise<void> => {
        await axiosInstance.put(`/Auth/users/${id}`, data);
    },

    deleteUser: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/Auth/users/${id}`);
    },
};
