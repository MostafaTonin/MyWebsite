import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5027/api';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Crucial for sending/receiving cookies
});

// Request Interceptor: Attach JWT token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Add language header
        const lang = localStorage.getItem('i18nextLng') || 'ar';
        config.headers['Accept-Language'] = lang;

        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle Refresh Token & Global Errors
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refresh_token');
            const token = localStorage.getItem('auth_token');

            if (refreshToken) {
                try {
                    // Call refresh endpoint with exact expected naming
                    const response = await axios.post(`${API_BASE_URL}/Auth/refresh-token`, {
                        token, // Optional but kept for compatibility
                        refreshToken
                    }, {
                        withCredentials: true
                    });

                    const { token: newToken, refreshToken: newRefreshToken } = response.data;

                    localStorage.setItem('auth_token', newToken);
                    localStorage.setItem('refresh_token', newRefreshToken);

                    // Update headers and retry original request with the new token
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    // If refresh fails, something is seriously wrong or session is truly dead
                    console.error('Session refresh failed:', refreshError);
                    clearAuthAndRedirect();
                    return Promise.reject(refreshError);
                }
            } else {
                clearAuthAndRedirect();
            }
        }

        return Promise.reject(error);
    }
);

const clearAuthAndRedirect = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth_user');

    // Redirect only if not already on login page to avoid loops
    if (!window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login?expired=true';
    }
};

export default axiosInstance;
