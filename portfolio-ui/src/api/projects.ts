import axiosInstance from './axios';
import type { Project } from '../types/api';

export const projectsApi = {
    getAll: async (): Promise<Project[]> => {
        const response = await axiosInstance.get<Project[]>('/Projects');
        return response.data;
    },

    getFeatured: async (): Promise<Project[]> => {
        const response = await axiosInstance.get<Project[]>('/Projects/featured');
        return response.data;
    },

    getHome: async (): Promise<Project[]> => {
        const response = await axiosInstance.get<Project[]>('/Projects/home');
        return response.data;
    },

    getById: async (id: number): Promise<Project> => {
        const response = await axiosInstance.get<Project>(`/Projects/${id}`);
        return response.data;
    },

    create: async (project: any): Promise<Project> => {
        const response = await axiosInstance.post<Project>('/Projects', project);
        return response.data;
    },

    update: async (id: number, project: any): Promise<Project> => {
        const response = await axiosInstance.put<Project>(`/Projects/${id}`, project);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/Projects/${id}`);
    },
};
