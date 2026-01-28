import axiosInstance from './axios';
import type { Skill } from '../types/api';

export const skillsApi = {
    getAll: async (): Promise<Skill[]> => {
        const response = await axiosInstance.get<Skill[]>('/Skills');
        return response.data;
    },

    getByCategory: async (category: string): Promise<Skill[]> => {
        const response = await axiosInstance.get<Skill[]>(`/Skills/by-category/${category}`);
        return response.data;
    },

    getAllAdmin: async (): Promise<Skill[]> => {
        const response = await axiosInstance.get<Skill[]>('/Skills/admin');
        return response.data;
    },

    getById: async (id: number): Promise<Skill> => {
        const response = await axiosInstance.get<Skill>(`/Skills/${id}`);
        return response.data;
    },

    create: async (skill: Omit<Skill, 'id'>): Promise<Skill> => {
        const response = await axiosInstance.post<Skill>('/Skills', skill);
        return response.data;
    },

    update: async (id: number, skill: Partial<Skill>): Promise<Skill> => {
        const response = await axiosInstance.put<Skill>(`/Skills/${id}`, skill);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/Skills/${id}`);
    },
};
