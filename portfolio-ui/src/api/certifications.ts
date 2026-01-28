import axiosInstance from './axios';
import type { Certification } from '../types/api';

export const certificationsApi = {
    getAll: async (): Promise<Certification[]> => {
        const response = await axiosInstance.get<Certification[]>('/Certifications');
        return response.data;
    },

    getFeatured: async (): Promise<Certification[]> => {
        const response = await axiosInstance.get<Certification[]>('/Certifications/featured');
        return response.data;
    },

    getByPlatform: async (type: string): Promise<Certification[]> => {
        const response = await axiosInstance.get<Certification[]>(`/Certifications/by-platform/${type}`);
        return response.data;
    },

    getAdminAll: async (): Promise<Certification[]> => {
        const response = await axiosInstance.get<Certification[]>('/Certifications/admin');
        return response.data;
    },

    getById: async (id: number): Promise<Certification> => {
        const response = await axiosInstance.get<Certification>(`/Certifications/${id}`);
        return response.data;
    },

    create: async (cert: any): Promise<Certification> => {
        const response = await axiosInstance.post<Certification>('/Certifications', cert);
        return response.data;
    },

    update: async (id: number, cert: any): Promise<void> => {
        await axiosInstance.put(`/Certifications/${id}`, cert);
    },

    delete: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/Certifications/${id}`);
    },

    toggleStatus: async (id: number): Promise<void> => {
        await axiosInstance.patch(`/Certifications/${id}/toggle`);
    },

    uploadLogo: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axiosInstance.post<{ url: string }>('/Certifications/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data.url;
    }
};
