import axiosInstance from './axios';
import type { Service } from '../types/api';

export const servicesApi = {
    getAll: async (): Promise<Service[]> => {
        const response = await axiosInstance.get<Service[]>('/Services');
        return response.data;
    },

    getHome: async (): Promise<Service[]> => {
        const response = await axiosInstance.get<Service[]>('/Services/home');
        return response.data;
    },

    getAllAdmin: async (): Promise<Service[]> => {
        const response = await axiosInstance.get<Service[]>('/Services/admin');
        return response.data;
    },

    getById: async (id: number): Promise<Service> => {
        const response = await axiosInstance.get<Service>(`/Services/${id}`);
        return response.data;
    },

    create: async (service: Omit<Service, 'id'>): Promise<Service> => {
        const response = await axiosInstance.post<Service>('/Services', service);
        return response.data;
    },

    update: async (id: number, service: Partial<Service>): Promise<Service> => {
        const response = await axiosInstance.put<Service>(`/Services/${id}`, service);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/Services/${id}`);
    },
};
