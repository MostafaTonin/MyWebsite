import axiosInstance from './axios';

export interface DashboardStats {
    totalPosts: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    totalUsers: number;
    trendingPosts: {
        id: number;
        title: string;
        views: number;
        likes: number;
        engagementRate: number;
    }[];
    monthlyActivity: {
        month: string;
        postCount: number;
        viewsCount: number;
    }[];
}

export const analyticsApi = {
    getDashboardStats: async (): Promise<DashboardStats> => {
        const response = await axiosInstance.get<DashboardStats>('/Analytics/dashboard');
        return response.data;
    },
    exportPostsCsv: async (): Promise<void> => {
        const response = await axiosInstance.get('/Analytics/export/posts', {
            responseType: 'blob'
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `blog-report-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
};
