import axiosInstance from './axios';
import type { BlogPost, BlogCategory } from '../types/api';

export interface BlogResponse {
    posts: BlogPost[];
    totalCount: number;
}

export const blogApi = {
    // Public Endpoints
    getPosts: async (page = 1, pageSize = 10, category?: string, search?: string): Promise<BlogResponse> => {
        const response = await axiosInstance.get<BlogResponse>('/Blog', {
            params: { page, pageSize, category, search },
        });
        return response.data;
    },

    getBySlug: async (slug: string): Promise<BlogPost> => {
        const response = await axiosInstance.get<BlogPost>(`/Blog/${slug}`);
        return response.data;
    },

    getCategories: async (): Promise<BlogCategory[]> => {
        const response = await axiosInstance.get<BlogCategory[]>('/Blog/categories');
        return response.data;
    },

    // Admin Endpoints
    getAdminAll: async (): Promise<BlogPost[]> => {
        const response = await axiosInstance.get<BlogPost[]>('/Blog/admin/all');
        return response.data;
    },

    getAdminById: async (id: number): Promise<BlogPost> => {
        const response = await axiosInstance.get<BlogPost>(`/Blog/admin/${id}`);
        return response.data;
    },

    create: async (post: any): Promise<BlogPost> => {
        const response = await axiosInstance.post<BlogPost>('/Blog', post);
        return response.data;
    },

    update: async (id: number, post: any): Promise<void> => {
        await axiosInstance.put(`/Blog/${id}`, post);
    },

    delete: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/Blog/${id}`);
    },

    getAdminCategories: async (): Promise<BlogCategory[]> => {
        const response = await axiosInstance.get<BlogCategory[]>('/Blog/admin/categories');
        return response.data;
    },

    createCategory: async (category: any): Promise<BlogCategory> => {
        const response = await axiosInstance.post<BlogCategory>('/Blog/categories', category);
        return response.data;
    },

    updateCategory: async (id: number, category: any): Promise<void> => {
        await axiosInstance.put(`/Blog/categories/${id}`, category);
    },

    deleteCategory: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/Blog/categories/${id}`);
    },

    like: async (id: number): Promise<void> => {
        await axiosInstance.post(`/Blog/${id}/like`);
    },

    dislike: async (id: number): Promise<void> => {
        await axiosInstance.post(`/Blog/${id}/dislike`);
    },

    addComment: async (id: number, comment: { authorName?: string; content: string, parentCommentId?: number }): Promise<any> => {
        const response = await axiosInstance.post(`/Blog/${id}/comments`, comment);
        return response.data;
    },

    deleteComment: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/Blog/comments/${id}`);
    },

    likeComment: async (commentId: number): Promise<void> => {
        await axiosInstance.post(`/Blog/comments/${commentId}/like`);
    },

    approveComment: async (commentId: number, approve = true): Promise<void> => {
        await axiosInstance.post(`/Blog/comments/${commentId}/approve?approve=${approve}`);
    },

    getAdminComments: async (postId: number): Promise<any[]> => {
        const response = await axiosInstance.get(`/Blog/admin/${postId}/comments`);
        return response.data;
    },
};
