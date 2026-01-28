import axiosInstance from './axios';
import type { AboutData } from '../types/api';

export const aboutApi = {
    get: async (): Promise<AboutData> => {
        const response = await axiosInstance.get<AboutData>('/About');
        return response.data;
    },

    update: async (data: Partial<AboutData>): Promise<AboutData> => {
        const response = await axiosInstance.put<AboutData>('/About', data);
        return response.data;
    },
};
