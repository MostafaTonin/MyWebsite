
import axiosInstance from './axios';
import type { SocialLink } from '../types/api';

export const socialLinksApi = {
    getAll: async (): Promise<SocialLink[]> => {
        const response = await axiosInstance.get<SocialLink[]>('/SocialLinks');
        return response.data;
    },

    getById: async (id: number): Promise<SocialLink> => {
        const response = await axiosInstance.get<SocialLink>(`/SocialLinks/${id}`);
        return response.data;
    },

    create: async (data: Omit<SocialLink, 'id'>): Promise<SocialLink> => {
        const response = await axiosInstance.post<SocialLink>('/SocialLinks', data);
        return response.data;
    },

    update: async (id: number, data: Partial<SocialLink>): Promise<void> => {
        await axiosInstance.put(`/SocialLinks/${id}`, data);
    },

    delete: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/SocialLinks/${id}`);
    },
};
