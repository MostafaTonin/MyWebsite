import axiosInstance from './axios';

interface UploadResponse {
    imageUrl: string;
}

export const uploadApi = {
    uploadImage: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axiosInstance.post<UploadResponse>('/Upload/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.imageUrl;
    },
};
