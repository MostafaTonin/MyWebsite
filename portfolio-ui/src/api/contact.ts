import axiosInstance from './axios';
import type { ContactMessage } from '../types/api';

export interface SendMessageData {
    Name: string;
    Email: string;
    PhoneNumber?: string;
    Subject: string;
    Message: string;
    PreferredContactMethod?: string;
}

export const contactApi = {
    // Public endpoint
    send: async (message: SendMessageData): Promise<{ messageAr: string, messageEn: string }> => {
        const response = await axiosInstance.post('/Contact', message);
        return response.data;
    },

    // Admin endpoints
    getAllAdmin: async (): Promise<ContactMessage[]> => {
        const response = await axiosInstance.get<ContactMessage[]>('/Contact/admin');
        return response.data;
    },

    getByIdAdmin: async (id: number): Promise<ContactMessage> => {
        const response = await axiosInstance.get<ContactMessage>(`/Contact/admin/${id}`);
        return response.data;
    },

    toggleReadAdmin: async (id: number): Promise<{ isRead: boolean }> => {
        const response = await axiosInstance.patch(`/Contact/admin/${id}/toggle-read`);
        return response.data;
    },

    deleteAdmin: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/Contact/admin/${id}`);
    },
};
